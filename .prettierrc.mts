import type { Options } from 'prettier'

export default {
    /**
     * 末尾分号
     * @default true
     */
    semi: false,
    /**
     * 单引号
     * @default false
     */
    singleQuote: true,
    // /**
    //  * 在 JSX 中使用单引号
    //  * @default false
    //  */
    // jsxSingleQuote: boolean;
    // /**
    //  * 末尾逗号
    //  * @default "all"
    //  */
    // trailingComma: : "none" | "es5" | "all";
    // /**
    //  * Print spaces between brackets in object literals.
    //  * @default true
    //  */
    // bracketSpacing: boolean;
    // /**
    //  * How to wrap object literals.
    //  * @default "preserve"
    //  */
    // objectWrap: "preserve" | "collapse";
    // /**
    //  * Put the `>` of a multi-line HTML (HTML, JSX, Vue, Angular) element at the end of the last line instead of being
    //  * alone on the next line (does not apply to self closing elements).
    //  * @default false
    //  */
    // bracketSameLine: boolean;
    // /**
    //  * Format only a segment of a file.
    //  * @default 0
    //  */
    // rangeStart: number;
    // /**
    //  * Format only a segment of a file.
    //  * @default Number.POSITIVE_INFINITY
    //  */
    // rangeEnd: number;
    // /**
    //  * Specify which parser to use.
    //  */
    // parser: LiteralUnion<BuiltInParserName>;
    // /**
    //  * Specify the input filepath. This will be used to do parser inference.
    //  */
    // filepath: string;
    // /**
    //  * Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file.
    //  * This is very useful when gradually transitioning large, unformatted codebases to prettier.
    //  * @default false
    //  */
    // requirePragma: boolean;
    // /**
    //  * Prettier can insert a special @format marker at the top of files specifying that
    //  * the file has been formatted with prettier. This works well when used in tandem with
    //  * the --require-pragma option. If there is already a docblock at the top of
    //  * the file then this option will add a newline to it with the @format marker.
    //  * @default false
    //  */
    // insertPragma: boolean;
    // /**
    //  * Prettier can allow individual files to opt out of formatting if they contain a special comment, called a pragma, at the top of he file.
    //  * @default false
    //  */
    // checkIgnorePragma: boolean;
    // /**
    //  * By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer.
    //  * In some cases you may want to rely on editor/viewer soft wrapping instead, so this option allows you to opt out.
    //  * @default "preserve"
    //  */
    // proseWrap: "always" | "never" | "preserve";
    /**
     * Include parentheses around a sole arrow function parameter.
     * @default "always"
     */
    arrowParens: 'avoid',
    // /**
    //  * Provide ability to support new languages to prettier.
    //  */
    // plugins: Array<string | URL | Plugin>;
    /**
     * How to handle whitespaces in HTML.
     * @default "css"
     */
    htmlWhitespaceSensitivity: 'ignore',
    // /**
    //  * Which end of line characters to apply.
    //  * @default "lf"
    //  */
    // endOfLine: "auto" | "lf" | "crlf" | "cr";
    // /**
    //  * Change when properties in objects are quoted.
    //  * @default "as-needed"
    //  */
    // quoteProps: "as-needed" | "consistent" | "preserve";
    // /**
    //  * 是否缩进 Vue 中的 <script> 和 <style> 标签的代码
    //  * @default false
    //  */
    // vueIndentScriptAndStyle: boolean;
    // /**
    //  * Control whether Prettier formats quoted code embedded in the file.
    //  * @default "auto"
    //  */
    // embeddedLanguageFormatting: "auto" | "off";
    // /**
    //  * Enforce single attribute per line in HTML, Vue and JSX.
    //  * @default false
    //  */
    // singleAttributePerLine: boolean;
    // /**
    //  * Where to print operators when binary expressions wrap lines.
    //  * @default "end"
    //  */
    // experimentalOperatorPosition: "start" | "end";
    // /**
    //  * Use curious ternaries, with the question mark after the condition, instead
    //  * of on the same line as the consequent.
    //  * @default false
    //  */
    // experimentalTernaries: boolean;
    // /**
    //  * Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
    //  * @default false
    //  * @deprecated use bracketSameLine instead
    //  */
    // jsxBracketSameLine?: boolean;

    // /**
    //  * Specify the line length that the printer will wrap on.
    //  * @default 80
    //  */
    // printWidth: number;
    /**
     * Specify the number of spaces per indentation-level.
     * @default 2
     */
    tabWidth: 4,
    // /**
    //  * Indent lines with tabs instead of spaces
    //  * @default false
    //  */
    // useTabs?: boolean;
    // parentParser?: string | undefined;
    // __embeddedInHtml?: boolean | undefined;
} satisfies Options
