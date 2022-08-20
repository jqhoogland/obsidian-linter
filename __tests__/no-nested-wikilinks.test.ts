import dedent from 'ts-dedent';
import NoNestedWikilinks from '../src/rules/no-nested-wikilinks';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: NoNestedWikilinks,
  testCases: [
    {
      // accounts for https://github.com/platers/obsidian-linter/issues/275
      testName: 'Leaves markdown links and images alone',
      before: dedent`
        [[Regular wikilink]]
        [[Nested/Wikilink]]
      `,
      after: dedent`
        [[Regular wikilink]]
        [[Wikilink]]
      `,
    },
  ],
});
