import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger {
  // TODO
  // Stream log to Syslog / Winston
}
