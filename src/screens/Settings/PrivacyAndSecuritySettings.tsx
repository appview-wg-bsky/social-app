import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {useAppPasswordsQuery} from '#/state/queries/app-passwords'
import {useSession} from '#/state/session'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {useTheme} from '#/alf'
import {Key_Stroke2_Corner2_Rounded as KeyIcon} from '#/components/icons/Key'
import {ShieldCheck_Stroke2_Corner0_Rounded as ShieldIcon} from '#/components/icons/Shield'
import * as Layout from '#/components/Layout'
import {Email2FAToggle} from './components/Email2FAToggle'

type Props = NativeStackScreenProps<
  CommonNavigatorParams,
  'PrivacyAndSecuritySettings'
>
export function PrivacyAndSecuritySettingsScreen({}: Props) {
  const {_} = useLingui()
  const t = useTheme()
  const {data: appPasswords} = useAppPasswordsQuery()
  const {currentAccount} = useSession()

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Privacy and Security</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <SettingsList.Item>
            <SettingsList.ItemIcon
              icon={ShieldIcon}
              color={
                currentAccount?.emailAuthFactor
                  ? t.palette.primary_500
                  : undefined
              }
            />
            <SettingsList.ItemText>
              {currentAccount?.emailAuthFactor ? (
                <Trans>Email 2FA enabled</Trans>
              ) : (
                <Trans>Two-factor authentication (2FA)</Trans>
              )}
            </SettingsList.ItemText>
            <Email2FAToggle />
          </SettingsList.Item>
          <SettingsList.LinkItem
            to="/settings/app-passwords"
            label={_(msg`App passwords`)}>
            <SettingsList.ItemIcon icon={KeyIcon} />
            <SettingsList.ItemText>
              <Trans>App passwords</Trans>
            </SettingsList.ItemText>
            {appPasswords && appPasswords.length > 0 && (
              <SettingsList.BadgeText>
                {appPasswords.length}
              </SettingsList.BadgeText>
            )}
          </SettingsList.LinkItem>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
