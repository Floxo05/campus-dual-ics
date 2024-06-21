import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { Observable } from 'rxjs';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY');

    if (apiKey && apiKey === validApiKey) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid API key');
    }
  }
}
