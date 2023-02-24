import { useUserStore } from "src/stores/user";
const routes = [
  {
    path: "/",
    name: "auth",
    component: () => import("pages/LoginRegister.vue"),
    beforeEnter: () => {
      const userStore = useUserStore();
      if (userStore.getUser) {
        return { name: "home" };
      }
      return true;
    },
  },
  {
    path: "/test",
    component: () => import("pages/testComponent.vue"),
  },
  {
    path: "/join",
    component: () => import("pages/PreLobby.vue"),
  },
  {
    path: "/home",
    component: () => import("src/layouts/HomeLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("src/pages/HomePage.vue"),
      },
    ],
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/games",
    name: "games",
    component: () => import("src/layouts/HomeLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("src/pages/gamesPage.vue"),
      },
      {
        path: ":gameMode",
        component: () => import("src/pages/gamePage.vue"),
      },
      {
        path: ":gameMode/settings",
        component: () => import("src/pages/gameSettingPage.vue"),
      },
    ],
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/lobby",
    component: () => import("src/layouts/GameLayout.vue"),
    props: { role: "lobby" },
    children: [
      {
        path: "",
        component: () => import("src/pages/lobbyPage.vue"),
      },
    ],
  },
  {
    path: "/static-lobby",
    component: () => import("src/layouts/GameLayout.vue"),
    props: { role: "lobby" },
    children: [
      {
        path: "",
        component: () => import("src/pages/staticLobbyPage.vue"),
      },
    ],
  },
  {
    path: "/:game(shami)",
    component: () => import("src/pages/shamiPage.vue"),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
