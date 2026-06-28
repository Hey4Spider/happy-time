import stylistic, { UnprefixedRuleOptions } from '@stylistic/eslint-plugin'
import { Config } from 'eslint/config'
import { ESLintRules } from 'eslint/rules'
import { RuleConfig, RulesConfig } from '@eslint/core'
import { RuleOptions } from 'eslint-plugin-vue/dist/eslint-typegen'

const _EsRules: Partial<ESLintRules> = {
    'no-unused-vars': 'off',
}

const _JsRules: Partial<{
    [K in keyof UnprefixedRuleOptions]: RuleConfig<UnprefixedRuleOptions[K]>
}> = {}

const _TsRules: RulesConfig = {
    'no-explicit-any': 'off',
    'triple-slash-reference': 'off',
    'no-unsafe-function-type': 'off',
    'no-unused-vars': [
        'warn',
        {
            ignoreRestSiblings: true,
            caughtErrors: 'none',
        },
    ],
}

export const VueRules: RuleOptions = {
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': ['warn', 4, { baseIndent: 1 }],
    'vue/max-attributes-per-line': [
        'error',
        {
            singleline: 3,
            multiline: 1,
        },
    ],
    'vue/html-closing-bracket-newline': [
        'warn',
        {
            selfClosingTag: {
                multiline: 'always',
            },
        },
    ],
    'vue/first-attribute-linebreak': ['warn', { multiline: 'below' }],
    'vue/block-order': [
        'warn',
        {
            order: ['template', 'script[setup]', 'style[scoped]'],
        },
    ],
}

export const CustomRules = {
    plugins: {
        '@stylistic': stylistic,
    },
    rules: {
        ...AddKeyPrefix('@stylistic', _JsRules),
        ...AddKeyPrefix('@typescript-eslint', _TsRules),
        ..._EsRules,
    },
} satisfies Config

function AddKeyPrefix<T extends Recordable>(prefix: string, data: T) {
    return Object.fromEntries(
        Object.keys(data).map(key => [`${prefix}/${key}`, data[key]]),
    )
}
