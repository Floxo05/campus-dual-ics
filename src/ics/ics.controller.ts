import {Controller, Get, Header, UseGuards} from '@nestjs/common';
import {ApiService} from "../api/api.service";
import {ApiKeyGuard} from "../api-key/api-key.guard";

@Controller('ics')
export class IcsController {
    constructor(private readonly apiService: ApiService) {}

    @Get()
    @UseGuards(ApiKeyGuard)
    @Header('Content-Type', 'text/calendar')
    getICS(): string {
        return this.apiService.getICSData();
    }
}
