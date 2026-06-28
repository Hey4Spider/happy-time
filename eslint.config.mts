import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import css from '@eslint/css'
import { defineConfig } from 'eslint/config'
import { CustomRules, VueRules } from './eslint.rule.mjs'
import prettier from 'eslint-plugin-prettier'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        ignores: ['node_modules', 'dist'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    tseslint.configs.recommended,
    pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            'no-undef': 'off',
            ...VueRules,
        },
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
    },
    // 在非 vue 文件中使用 prettier
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { prettier },
        rules: { 'prettier/prettier': 'error' },
    },
    CustomRules,
])
