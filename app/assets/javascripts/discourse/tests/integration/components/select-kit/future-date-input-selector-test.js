import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import {
  discourseModule,
  exists,
  query,
} from "discourse/tests/helpers/qunit-helpers";
import hbs from "htmlbars-inline-precompile";
import selectKit from "discourse/tests/helpers/select-kit-helper";
import I18n from "I18n";

function assertOptionExists(assert, name, num) {
  assert.ok(
    query(`ul.select-kit-collection li:nth-child(${num}) span`).innerText ===
      I18n.t(`topic.auto_update_input.${name}`),
    `"${name}" is rendered`
  );
}

discourseModule(
  "Integration | Component | select-kit/future-date-input-selector",
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.set("subject", selectKit());
    });

    componentTest("rendering and expanding", {
      template: hbs`
        {{future-date-input-selector
          options=(hash
            none="topic.auto_update_input.none"
          )
        }}
      `,

      async test(assert) {
        assert.ok(
          exists("div.future-date-input-selector"),
          "Selector is rendered"
        );

        assert.ok(
          query("span").innerText === I18n.t("topic.auto_update_input.none"),
          "Default text is rendered"
        );

        await this.subject.expand();

        assert.ok(exists("div.select-kit-body"), "Selector is expanded");

        assert.ok(
          exists("ul.select-kit-collection"),
          "List of options is rendered"
        );
      },
    });

    componentTest("default options", {
      template: hbs`{{future-date-input-selector}}`,

      async test(assert) {
        await this.subject.expand();

        assertOptionExists(assert, "later_today", 1);
        assertOptionExists(assert, "tomorrow", 2);
        assertOptionExists(assert, "next_week", 3);
        assertOptionExists(assert, "two_weeks", 4);
        assertOptionExists(assert, "next_month", 5);
        assertOptionExists(assert, "two_months", 6);
        assertOptionExists(assert, "three_months", 7);
        assertOptionExists(assert, "four_months", 8);
        assertOptionExists(assert, "six_months", 9);

        assert.notOk(
          query(`ul.select-kit-collection li:nth-child(10) span`),
          "10th option doesn't exist"
        );
      },
    });

    componentTest("far feature options", {
      template: hbs`
        {{future-date-input-selector
          includeFarFuture=true
        }}
      `,

      async test(assert) {
        await this.subject.expand();

        assertOptionExists(assert, "one_year", 10);
        assertOptionExists(assert, "forever", 11);

        assert.notOk(
          query(`ul.select-kit-collection li:nth-child(12) span`),
          "12th option doesn't exist"
        );
      },
    });
  }
);
