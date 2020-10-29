import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import * as serviceWorker from './serviceWorker';

const style = 'color:rgba(43,80,174,0.9);';

console.info(`%c
██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗███╗   ███╗███████╗███╗   ██╗
██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║████╗ ████║██╔════╝████╗  ██║
██║ █╗ ██║███████║   ██║   ██║     ███████║██╔████╔██║█████╗  ██╔██╗ ██║
██║███╗██║██╔══██║   ██║   ██║     ██╔══██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║
╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║██║ ╚═╝ ██║███████╗██║ ╚████║
 ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝
                                                                        
██╗███╗   ███╗███╗   ███╗ █████╗                                        
██║████╗ ████║████╗ ████║██╔══██╗                                       
██║██╔████╔██║██╔████╔██║███████║                                       
██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║                                       
██║██║ ╚═╝ ██║██║ ╚═╝ ██║██║  ██║                                       
╚═╝╚═╝     ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝                                       
`, style);

ReactDOM.render(
	<React.StrictMode>
		<App/>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

