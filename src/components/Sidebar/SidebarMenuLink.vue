<!--
  MIT License

  Copyright (c) 2018 yaminncco
  Copyright (c) 2021 Toni Harzendorf

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
-->
<template>
  <a v-if="isHyperLink" v-bind="$attrs">
    <slot />
  </a>
  <router-link v-else v-slot="{ href, navigate }" custom :to="$attrs.href">
    <a v-bind="$attrs" :href="href" @click="navigate">
      <slot />
    </a>
  </router-link>
</template>

<script>
export default {
  name: "SidebarMenuLink",
  inheritAttrs: false,
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      router: false,
    };
  },
  computed: {
    isHyperLink() {
      return !!(!this.item.href || this.item.external || !this.router);
    },
  },
  mounted() {
    this.router = !!this.$router;
  },
};
</script>
