import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService {
  private logFilePath: string;

  constructor() {
    this.logFilePath = path.join(__dirname, 'logs', 'application.log');
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    const dir = path.dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  logRequest(url: string, query: any, body: any, statusCode: number) {
    const logMessage = `Request: ${url}, Query: ${JSON.stringify(
      query,
    )}, Body: ${JSON.stringify(body)}, Status: ${statusCode}\n`;
    this.writeLog(logMessage);
  }

  logError(error: any) {
    const logMessage = `Error: ${error}\n`;
    this.writeLog(logMessage);
  }

  private writeLog(message: string) {
    fs.appendFileSync(this.logFilePath, message, { encoding: 'utf8' });
  }
}
