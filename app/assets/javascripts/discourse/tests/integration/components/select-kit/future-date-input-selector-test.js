import componentTest, {
  setupRenderingTest,
} from "discourse/tests/helpers/component-test";
import {
  discourseModule,
  exists,
  query,
  queryAll,
} from "discourse/tests/helpers/qunit-helpers";
import hbs from "htmlbars-inline-precompile";
import selectKit from "discourse/tests/helpers/select-kit-helper";
import I18n from "I18n";

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

        assert.equal(
          query(".future-date-input-selector-header").getAttribute(
            "aria-expanded"
          ),
          "true",
          "Selector is expanded"
        );

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

        const options = Array.from(
          queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
            x.innerText.trim()
          )
        );

        const expected = [
          I18n.t("topic.auto_update_input.tomorrow"),
          I18n.t("topic.auto_update_input.next_week"),
          I18n.t("topic.auto_update_input.two_weeks"),
          I18n.t("topic.auto_update_input.next_month"),
          I18n.t("topic.auto_update_input.two_months"),
          I18n.t("topic.auto_update_input.three_months"),
          I18n.t("topic.auto_update_input.four_months"),
          I18n.t("topic.auto_update_input.six_months"),
        ];

        assert.deepEqual(options, expected);
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

        const options = Array.from(
          queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
            x.innerText.trim()
          )
        );

        const expected = [
          I18n.t("topic.auto_update_input.tomorrow"),
          I18n.t("topic.auto_update_input.next_week"),
          I18n.t("topic.auto_update_input.two_weeks"),
          I18n.t("topic.auto_update_input.next_month"),
          I18n.t("topic.auto_update_input.two_months"),
          I18n.t("topic.auto_update_input.three_months"),
          I18n.t("topic.auto_update_input.four_months"),
          I18n.t("topic.auto_update_input.six_months"),
          I18n.t("topic.auto_update_input.one_year"),
          I18n.t("topic.auto_update_input.forever"),
        ];

        assert.deepEqual(options, expected);
      },
    });
  }
);
