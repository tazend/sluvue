<template>
  <div class="sv-basic-checkbox">
    <input
      :id="identifier"
      type="checkbox"
      @input="checkBoxClicked()"
      :checked="isChecked"
    />
    <div class="sv-input--control">
      <label :for="identifier" class="sv-symbol">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="sv-symbol__svg"
          :class="[
            isChecked ? 'sv-symbol__svg--checked' : 'sv-symbol__svg--empty',
          ]"
        >
          <path :d="svgPath" />
        </svg>
      </label>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "SVBasicCheckbox",
  props: {
    identifier: {
      type: Number,
      required: true,
    },
    boxes: {
      Type: Array,
      required: true,
    },
  },
  emits: ["update:boxes"],
  setup(props, context) {
    // Checkmark
    const checkedPath = "m20.5 6-11 12-6-6";

    // Empty Box
    const uncheckedPath =
      "m 2.7005,1.5005 h 18.599 c 0.6648,0 1.200001,0.5352 1.200001,1.2 v 18.599 " +
      "c 0,0.6648 -0.535201,1.200001 -1.200001,1.200001 H 2.7005 c -0.6648,0 " +
      "-1.2,-0.535201 -1.2,-1.200001 V 2.7005 c 0,-0.6648 0.5352,-1.2 1.2,-1.2 z";

    // Check if Box with ID "identifier" is checked
    // by looking up if it is in the "boxes" Array
    const isChecked = computed(() => {
      return props.boxes.includes(props.identifier);
    });

    function checkBoxClicked() {
      let updatedBoxes = [...props.boxes];

      if (!this.isChecked) {
        // Add Value to Array
        updatedBoxes.push(props.identifier);
      } else {
        // Remove Value from Array
        updatedBoxes.splice(updatedBoxes.indexOf(props.identifier), 1);
      }

      // Emit Event that "boxes" Array has been updated
      context.emit("update:boxes", updatedBoxes);
    }

    // Change which SVGPath to use depending on if Box is checked or not
    const svgPath = computed(() => {
      return isChecked.value ? checkedPath : uncheckedPath;
    });

    return {
      checkBoxClicked,
      svgPath,
      isChecked,
    };
  },
};
</script>

<style lang="scss" scoped>
$basic-checkbox-background-color--checked: rgb(110, 105, 105);
$basic-checkbox-stroke-color--checked: #fff;
$basic-checkbox-stroke-color--empty: rgb(110, 105, 105);
$basic-checkbox-stroke-width--checked: 2.5px;
$basic-checkbox-stroke-width--empty: 3px;
$basic-checkbox-border-radius--checked: 2.1px;

$basic-checkbox-stroke-linejoin--empty: bevel;
$basic-checkbox-stroke-linecap--empty: round;

$basic-checkbox-svg-fill: none;
$basic-checkbox-svg-fill-opacity: 0;

.sv-basic-checkbox {
  width: 48px;
  height: 18px;

  input {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .sv-input--control {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
  }

  .sv-symbol {
    width: 100%;
    height: 100%;
    cursor: pointer;

    &__svg {
      display: block;
      margin: 0 auto;
      width: 18px;
      height: 18px;
      fill-opacity: $basic-checkbox-svg-fill-opacity;
      fill: $basic-checkbox-svg-fill;

      &--empty {
        stroke: $basic-checkbox-stroke-color--empty;
        stroke-width: $basic-checkbox-stroke-width--empty;
        stroke-linejoin: $basic-checkbox-stroke-linejoin--empty;
        stroke-linecap: $basic-checkbox-stroke-linecap--empty;
      }

      &--checked {
        stroke: $basic-checkbox-stroke-color--checked;
        stroke-width: $basic-checkbox-stroke-width--checked;
        border-radius: $basic-checkbox-border-radius--checked;
        background-color: $basic-checkbox-background-color--checked;
      }
    }
  }
}
</style>
