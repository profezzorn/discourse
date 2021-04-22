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

    componentTest("shows default options", {
      template: hbs`
        {{future-date-input-selector
          frozenTime=frozenTime
        }}
      `,

      beforeEach() {
        this.setProperties({ frozenTime: moment("2021-04-19 08:00:00") }); // Monday
      },

      async test(assert) {
        await this.subject.expand();

        const options = Array.from(
          queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
            x.innerText.trim()
          )
        );

        const expected = [
          I18n.t("topic.auto_update_input.later_today"),
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

    componentTest("shows far future options", {
      template: hbs`
        {{future-date-input-selector
          includeFarFuture=true
          frozenTime=frozenTime
        }}
      `,

      beforeEach() {
        this.setProperties({ frozenTime: moment("2021-04-19 08:00:00") }); // Monday
      },

      async test(assert) {
        await this.subject.expand();

        const options = Array.from(
          queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
            x.innerText.trim()
          )
        );

        const expected = [
          I18n.t("topic.auto_update_input.later_today"),
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

    componentTest("shows 'Pick date and time'", {
      template: hbs`
        {{future-date-input-selector
          includeDateTime=true
          frozenTime=frozenTime
        }}
      `,

      beforeEach() {
        this.setProperties({ frozenTime: moment("2021-04-19 08:00:00") }); // Monday
      },

      async test(assert) {
        await this.subject.expand();

        const options = Array.from(
          queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
            x.innerText.trim()
          )
        );

        const expected = [
          I18n.t("topic.auto_update_input.later_today"),
          I18n.t("topic.auto_update_input.tomorrow"),
          I18n.t("topic.auto_update_input.next_week"),
          I18n.t("topic.auto_update_input.two_weeks"),
          I18n.t("topic.auto_update_input.next_month"),
          I18n.t("topic.auto_update_input.two_months"),
          I18n.t("topic.auto_update_input.three_months"),
          I18n.t("topic.auto_update_input.four_months"),
          I18n.t("topic.auto_update_input.six_months"),
          I18n.t("topic.auto_update_input.pick_date_and_time"),
        ];

        assert.deepEqual(options, expected);
      },
    });

    componentTest(
      "hide 'Later Today' and shows 'Later this week' at the end of the day",
      {
        template: hbs`
        {{future-date-input-selector
          frozenTime=frozenTime
        }}
      `,

        beforeEach() {
          this.setProperties({ frozenTime: moment("2021-04-19 18:00:00") }); // Monday evening
        },

        async test(assert) {
          await this.subject.expand();

          const options = Array.from(
            queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
              x.innerText.trim()
            )
          );

          const expected = [
            I18n.t("topic.auto_update_input.tomorrow"),
            I18n.t("topic.auto_update_input.later_this_week"),
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
      }
    );

    componentTest(
      "hide 'Later Today' and doesn't show 'Later this week' at the end of the day in the end of the week",
      {
        template: hbs`
        {{future-date-input-selector
          frozenTime=frozenTime
        }}
      `,

        beforeEach() {
          this.setProperties({ frozenTime: moment("2021-04-22 18:00:00") }); // Tuesday evening
        },

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
      }
    );

    componentTest("shows 'This Weekend' on Tuesday", {
      template: hbs`
        {{future-date-input-selector
          includeWeekend=true
          frozenTime=frozenTime
        }}
      `,

      beforeEach() {
        this.setProperties({ frozenTime: moment("2021-04-22 18:00:00") }); // Tuesday
      },

      async test(assert) {
        await this.subject.expand();

        const options = Array.from(
          queryAll(`ul.select-kit-collection li span.name`).map((_, x) =>
            x.innerText.trim()
          )
        );

        const expected = [
          I18n.t("topic.auto_update_input.tomorrow"),
          I18n.t("topic.auto_update_input.this_weekend"),
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

    componentTest("doesn't show 'This Weekend' on Friday", {
      template: hbs`
        {{future-date-input-selector
          includeWeekend=true
          frozenTime=frozenTime
        }}
      `,

      beforeEach() {
        this.setProperties({ frozenTime: moment("2021-04-23 18:00:00") }); // Friday
      },

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

    componentTest("doesn't show 'Next Month' on the last day of the month", {
      template: hbs`
        {{future-date-input-selector
          frozenTime=frozenTime
        }}
      `,

      beforeEach() {
        this.setProperties({ frozenTime: moment("2021-04-30 18:00:00") }); // The last day of April
      },

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
          I18n.t("topic.auto_update_input.two_months"),
          I18n.t("topic.auto_update_input.three_months"),
          I18n.t("topic.auto_update_input.four_months"),
          I18n.t("topic.auto_update_input.six_months"),
        ];

        assert.deepEqual(options, expected);
      },
    });
  }
);
