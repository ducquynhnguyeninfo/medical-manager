import { StoreContext, store } from "../../Libs/Stores";
import { Component } from 'react';
import { RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import { SnackbarProvider } from 'notistack';
import { routers2 } from '../../Libs/Routers/Routes';
import "./App.css";

const router = createBrowserRouter([
	{ path: "*", Component: Root }
])

function Root() {
	return (<Routes>
		{routers2}
	</Routes>)
}

class App extends Component {
	render() {
		return (
			< StoreContext.Provider value={store} >
				<SnackbarProvider maxSnack={3}>
					<RouterProvider router={router} />
				</SnackbarProvider>
			</StoreContext.Provider >
		);
	}
}
export default App;