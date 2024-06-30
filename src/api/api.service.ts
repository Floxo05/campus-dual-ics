import { Injectable, Logger } from '@nestjs/common';
import { EventAttributes } from 'ics';
import * as schedule from 'node-schedule';
import * as fs from 'fs';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);
  private data: EventAttributes[] = [];

  constructor() {
    this.loadData();
    // Schedule the fetchData method to run every 10 minutes
    schedule.scheduleJob('*/10 * * * *', () => this.loadData());
  }

  async loadData() {
    try {
      this.logger.log('Loading data');
      this.data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
      this.data = this.transformToICSFormat(this.data);
    } catch (error) {
      this.logger.error('Error loading data', error);
    }
  }

  transformToICSFormat(data: any): EventAttributes[] {
    return data.map(item => {
      // Konvertiere Unix-Zeitstempel in Datum und Uhrzeit
      const startDate = new Date(item.start * 1000);
      const endDate = new Date(item.end * 1000);

      // Extrahiere Datum und Uhrzeitkomponenten
      const start = [
        startDate.getFullYear(),
        startDate.getMonth() + 1, // Monate sind 0-basiert in JavaScript
        startDate.getDate(),
        startDate.getHours() + 2,
        startDate.getMinutes(),
      ];

      const end = [
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate(),
        endDate.getHours() + 2,
        endDate.getMinutes(),
      ];

      return {
        title: item.title,
        start: start,
        end: end,
        description: item.description,
        location: item.room,
        status: 'CONFIRMED',
        organizer: { name: item.instructor },
      };
    });
  }

  getICSData(): string {
    let eventString = 'BEGIN:VCALENDAR\n' +
      'VERSION:2.0\n' +
      'PRODID:-////NONSGML campus-dual.de iCalcreator 2.12//\n' +
      'X-AFILE:iCal.php\n' +
      'X-WR-TIMEZONE:Europe/Berlin\n';

    for (const event of this.data) {
      eventString += this.createICSEvent(event);
    }

    eventString += 'END:VCALENDAR';

    return eventString;
  }

  createICSEvent(event: EventAttributes): string {
    let eventString: string = '';

    const convertDate = (date: Array<number>): string => {
        let out = '';
        if (Array.isArray(event.start)) {
            date.forEach((val, index) => {
                const str_val = val.toString();
                if (str_val.length === 1) {
                    out += '0' + str_val;
                } else {
                    out += str_val;
                }
                if (index === 2) {
                    out += 'T';
                }
            })
            out += '00';
        }

        return out;
    }

    // Convert start and end DateTime objects to strings
    let start = '';
    if (Array.isArray(event.start)) {
        start = convertDate(event.start)
    }

    let end = '';
    if (Array.isArray(event['end'])) {
        end = convertDate(event['end'])
    }

    eventString += 'BEGIN:VEVENT\n';
    eventString += `DTSTART:${start}\n`;
    eventString += `DTEND:${end}\n`;
    eventString += `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '')}Z\n`;
    eventString += `UID:${Math.random().toString(36).substring(2)}@example.com\n`;
    eventString += `DESCRIPTION:${event.description}\\n${event.location}\\n${event.organizer.name}\n`;
    eventString += `SUMMARY:${event.title}\n`;
    eventString += 'END:VEVENT\n';

    return eventString;
  }
}
