import { Injectable } from '@nestjs/common';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  statSync,
  renameSync,
} from 'fs';
import { join } from 'path';

@Injectable()
export class LoggingService {
  private readonly logFilePath: string = join(__dirname, 'logs', 'app.log');
  private readonly logLevel = process.env.LOG_LEVEL || 'info';
  private readonly maxFileSize = parseInt(
    process.env.LOG_FILE_SIZE || '1024',
    10,
  );
  private readonly levels = ['info', 'error'];

  constructor() {
    this.checkLogDirExists();
  }

  private checkLogDirExists() {
    const logDir = join(__dirname, 'logs');
    if (existsSync(logDir)) return;

    mkdirSync(logDir, { recursive: true });
  }

  private updateFileName(): void {
    if (!existsSync(this.logFilePath)) return;

    const stat = statSync(this.logFilePath);
    if (stat.size > this.maxFileSize * 1024) {
      const updatedFilePath = `${this.logFilePath}.${Date.now()}`;
      renameSync(this.logFilePath, updatedFilePath);
    }
  }

  private writeToFile(message: string): void {
    this.updateFileName();
    appendFileSync(this.logFilePath, `${message}\n`);
  }

  private writeLog(level: string, message: string): void {
    if (this.levels.indexOf(level) >= this.levels.indexOf(this.logLevel)) {
      const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
      this.writeToFile(logMessage);
    }
  }

  info(message: string): void {
    this.writeLog('info', message);
  }

  error(message: string): void {
    this.writeLog('error', message);
  }
}
