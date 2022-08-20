import {logError} from 'src/logger';
import dedent from 'ts-dedent';
import {Options, RuleType} from '../rules';
import {ignoreListOfTypes} from '../utils/ignore-types';
import RuleBuilder, {BooleanOptionBuilder, ExampleBuilder, OptionBuilderBase} from './rule-builder';

class NoNestedWikilinksOptions implements Options {
  // Whether to change wikilinks in place or log to console
  write?: boolean = false;
}

@RuleBuilder.register
export default class NoNestedWikilinks extends RuleBuilder<NoNestedWikilinksOptions> {
  get OptionsClass(): new () => NoNestedWikilinksOptions {
    return NoNestedWikilinksOptions;
  }
  get name(): string {
    return 'No Nested Wikilinks';
  }
  get description(): string {
    return 'Logs an error for any wikilinks that contain a nested path, e.g.: `[[My/Nested/Path]]`, to help you catch duplicate notes.';
  }
  get type(): RuleType {
    return RuleType.CONTENT;
  }
  apply(text: string, options: NoNestedWikilinksOptions): string {
    console.log('[Lint] hello');
    return ignoreListOfTypes([], text, (text) => {
      return text.replace(/\[\[([^\[\]|]+)(?:|([^\[\]]+))?\]\]/g, (match, link: string, alias: string | undefined) => {
        const linkParts = link.split('/');

        if (linkParts.length > 1) {
          // TODO: Log current file
          logError(`no-nested-wikilink`, new Error(match));
        }

        if (options.write) {
          const strippedLink = linkParts.pop();
          return `[[${strippedLink}${alias ?? ''}]]`;
        }

        return match;
      });
    });
  }
  get exampleBuilders(): ExampleBuilder<NoNestedWikilinksOptions>[] {
    return [
      new ExampleBuilder({
        description: '',
        before: dedent``,
        after: dedent``,
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<NoNestedWikilinksOptions>[] {
    return [
      new BooleanOptionBuilder({
        OptionsClass: NoNestedWikilinksOptions,
        name: 'No Nested Wikilinks write in place',
        description: 'Whether to strip nested wikilinks in place. If false, simply logs to console. Caution: setting `write` to true can be destructive.',
        optionsKey: 'write',
      }),
    ];
  }
}
