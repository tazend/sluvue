<template>
  <sidebar-menu />
  <router-view />
</template>

<script>
import SidebarMenu from "@/components/Sidebar/SidebarMenu";

export default {
  name: "App",
  components: {
    SidebarMenu,
  },
};
</script>
