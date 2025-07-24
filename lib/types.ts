import { type Puck, type Config, type UserGenerics, type PuckProps, type FieldRenderFunctions } from '@measured/puck'

export type ds<UserConfig extends Config = Config, G extends UserGenerics<UserConfig> = UserGenerics<UserConfig>> = Puck<UserConfig, G>

type a = FieldRenderFunctions