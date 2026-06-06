import { Module } from '@nestjs/common'
import { AppConfigModule } from '@/common/config/config.module'
import { DatabaseModule } from './modules/database/database.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [AppConfigModule, DatabaseModule, AuthModule],
})
export class AppModule {}
