import { store } from "quasar/wrappers";
import { createPinia } from "pinia";
import { serializer } from "src/utilities/helpers";
import { useGameStore } from "./game";
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const pinia = createPinia();
  // You can add Pinia plugins here
  // pinia.use(SomePiniaPlugin)
  pinia.use(({ store }) => {
    const storeID = store.$id;
    if (storeID !== "user") return;
    const fromStorage = serializer.deserialize(
      window.localStorage.getItem(storeID)
    );
    if (fromStorage) {
      store.$patch(fromStorage);
    }
    // listen for the event when user logs in
    store.$subscribe(({ events }, state) => {
      const gameStore = useGameStore();
      // logout
      if (events?.newValue === null) {
        gameStore._logoutGamePlayer();
        window.localStorage.removeItem(storeID);
      } else {
        // login
        // write the uuid to the localstorage(session)
        const { uuid } = state.state.user;
        gameStore._serializeGamePlayer(uuid);
        // store the user info in the localStorage
        window.localStorage.setItem(storeID, serializer.serialize(state));
      }
    });
  });
  return pinia;
});
