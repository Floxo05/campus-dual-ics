import {Injectable, Logger} from '@nestjs/common';
import {createEvent, EventAttributes} from "ics";
import * as schedule from 'node-schedule';
import * as fs from "fs";

@Injectable()
export class ApiService {
    private readonly logger = new Logger(ApiService.name);
    private data: EventAttributes[] = [];

    constructor() {
        this.loadData();
        // Schedule the fetchData method to run every 10 minutes
        schedule.scheduleJob('* * * * *', () => this.loadData());
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
                startDate.getHours(),
                startDate.getMinutes(),
            ];

            const end = [
                endDate.getFullYear(),
                endDate.getMonth() + 1,
                endDate.getDate(),
                endDate.getHours(),
                endDate.getMinutes(),
            ];

            return {
                title: item.title,
                start: start,
                end: end,
                description: item.description,
                location: item.room,
                status: 'CONFIRMED',
                organizer: {name: item.instructor},
            };
        });
    }

    getICSData(): string {
        let icsString = '';
        this.data.forEach(event => {
            createEvent(event, (error, value) => {
                if (error) {
                    this.logger.error('Error creating ICS event', error);
                } else {
                    icsString += value + '\n';
                }
            });
        });
        return icsString;
    }
}
