import { Injectable } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    ) {}

    checkAuthTypeorm() {
        return this.healthCheckService.check([
            () => this.typeOrmHealthIndicator.pingCheck('auth', { timeout: 1500 })
        ])
    }
}
