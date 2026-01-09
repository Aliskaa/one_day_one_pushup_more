import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'

// Custom styles ...
const customTokens = createTokens({
    color: {
        purple1: '#faf5ff',
        purple2: '#f3e8ff',
        purple3: '#e9d5ff',
        purple4: '#d8b4fe',
        purple5: '#c084fc',
        purple6: '#a855f7',
        purple7: '#9333ea',
        purple8: '#7e22ce',
        purple9: '#904bff',
        purple10: '#6b21a8',
        purple11: '#581c87',
        purple12: '#3b0764',
    },
    radius: defaultConfig.tokens.radius,
    zIndex: defaultConfig.tokens.zIndex,
    space: defaultConfig.tokens.space,
    size: defaultConfig.tokens.size,
})

const baseTheme = defaultConfig.themes.light_blue

const config = {
    ...defaultConfig,
    tokens: customTokens,
    themes: {
        ...defaultConfig.themes,
        purple: {
            ...baseTheme,
            background: customTokens.color.purple9,
            backgroundHover: customTokens.color.purple8,
            backgroundPress: customTokens.color.purple10,
            backgroundFocus: customTokens.color.purple9,
            color: "#ffffff",
            colorHover: "#ffffff",
            colorPress: "#ffffff",
            colorFocus: "#ffffff",
            borderColor: customTokens.color.purple9,
            borderColorHover: customTokens.color.purple8,
            borderColorPress: customTokens.color.purple10,
            borderColorFocus: customTokens.color.purple9,
        },

    },
}

export const tamaguiConfig = createTamagui(config)

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
    interface TamaguiCustomConfig extends Conf { }
}