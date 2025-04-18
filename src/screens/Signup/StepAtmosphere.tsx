import React from 'react'
import {View} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {logger} from '#/logger'
import {isWeb} from '#/platform/detection'
import {ScreenTransition} from '#/screens/Login/ScreenTransition'
import {useSignupContext} from '#/screens/Signup/state'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {InlineLinkText} from '#/components/Link'
import {Text} from '#/components/Typography'
import {BackNextButtons} from './BackNextButtons'

export function StepAtmosphere({
  onPressBack,
  onPressSignIn,
}: {
  onPressBack: () => void
  onPressSignIn: () => void
}) {
  const {_} = useLingui()
  const t = useTheme()
  const {state, dispatch} = useSignupContext()

  const onNextPress = React.useCallback(async () => {
    logger.metric(
      'signup:nextPressed',
      {
        activeStep: state.activeStep,
      },
      {statsig: true},
    )
    dispatch({type: 'next'})
  }, [dispatch, state.activeStep])

  const onBackPress = React.useCallback(() => {
    logger.metric(
      'signup:backPressed',
      {activeStep: state.activeStep},
      {statsig: true},
    )
    onPressBack()
  }, [state.activeStep, onPressBack])

  return (
    <ScreenTransition>
      <View style={[a.gap_xl]}>
        <Text style={[a.gap_md, a.leading_snug]}>
          <Trans>
            deer.social is part of the{' '}
            {
              <InlineLinkText
                label={_(msg`ATmosphere`)}
                to="https://atproto.com/">
                <Trans>ATmosphere</Trans>
              </InlineLinkText>
            }
            —the network of apps, services, and accounts built on the AT
            Protocol. For example, if you already have a Bluesky account you are
            already part of this ecosystem. That means you can sign in right now
            with your existing account.
          </Trans>
        </Text>
        <View style={isWeb && [a.flex_row, a.justify_start]}>
          <Button
            testID="signInButton"
            onPress={onPressSignIn}
            label={_(msg`Sign in with ATmosphere`)}
            accessibilityHint={_(
              msg`Opens flow to sign in to your existing ATmosphere account`,
            )}
            size="large"
            variant="solid"
            color="primary">
            <ButtonText>
              <Trans>Sign in with ATmosphere</Trans>
            </ButtonText>
          </Button>
        </View>
        <Text style={[a.gap_md, t.atoms.text_contrast_medium, a.leading_snug]}>
          <Trans>
            Don’t have an account in the ATmosphere yet? You can create one on
            the next page. Just note that you'll need to choose a Personal Data
            Server (
            {
              <InlineLinkText
                label={_(msg`PDS`)}
                to="https://atproto.com/guides/self-hosting">
                <Trans>PDS</Trans>
              </InlineLinkText>
            }
            ) that isn’t hosted by Bluesky. If you want to use a Bluesky-hosted
            PDS, you’ll need to sign up through bsky.app first, then return here
            to continue.
          </Trans>
        </Text>
      </View>
      <BackNextButtons
        isLoading={false}
        isNextDisabled={false}
        onBackPress={onBackPress}
        onNextPress={onNextPress}
      />
    </ScreenTransition>
  )
}
