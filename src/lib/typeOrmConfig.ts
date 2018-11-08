
export interface ITypeOrmConfig {
    name: string
    type: string
    host: string
    username: string
    password: string
    port: number
    sid: string
    database: string
    synchronize: boolean
    logging: boolean
  }