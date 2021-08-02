<template>
  <div class="sv-basic-checkbox">
    <div class="sv-input--control" @click="checkBoxClicked()">
      <span class="sv-symbol">
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
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "SVBasicCheckbox",
  props: {
    // Array that holds all the "values" of Boxes that are checked
    boxes: {
      type: Array,
      default: () => [],
      required: true,
    },
    // value of a Box (expected to be unique accross checkboxes in "boxes")
    value: {
      type: String,
      required: true,
    },
    // "values" of other boxes that this Box is a parent of
    // E.g, checking this box will check all boxes provided in <Array>
    parentOfBoxes: {
      type: Array,
      default: () => [],
      required: false,
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

    // Does this Checkbox act as a Parent for other Checkboxes?
    const isParent = computed(() => {
      return props.parentOfBoxes && props.parentOfBoxes.length;
    });

    // See if all boxes are checked that this Checkbox is a Parent of
    // Always "false" when this Checkbox doesn't act as a Parent
    const allChecked = computed(() => {
      let res = false;

      if (isParent.value && props.boxes.length) {
        if (props.parentOfBoxes.every((el) => props.boxes.includes(el))) {
          res = true;
        }
      }

      return res;
    });

    // True when "value" of a Box is inside the "boxes" Array
    const isChecked = computed(() => {
      let checked = false;

      if (props.boxes.includes(props.value) || allChecked.value) {
        checked = true;
      }

      return checked;
    });

    function checkBoxClicked() {
      let updatedBoxes = [...props.boxes];

      if (!isParent.value) {
        // This Checkbox is not a Parent of other boxes
        if (!isChecked.value) {
          // Add Value to Array
          updatedBoxes.push(props.value);
        } else {
          // Remove Value from Array
          updatedBoxes.splice(updatedBoxes.indexOf(props.value), 1);
        }
      } else if (isParent.value) {
        // This Checkbox is a parent of other boxes
        if (allChecked.value) {
          updatedBoxes = [];
        } else {
          updatedBoxes = props.parentOfBoxes;
        }
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

  .sv-input--control {
    width: 18px;
    height: 18px;
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
