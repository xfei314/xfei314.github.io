import xdrag from "./xdrag";
import xresize from "./xresize";
const directives = [xdrag, xresize];
export default app => {
	for (const item of directives) {
		app.directive(item.name, item);
	}
};
