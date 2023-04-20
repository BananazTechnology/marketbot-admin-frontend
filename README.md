# Market Bot Manager

## Setup instructions
Because this is an HTML app we do some fancy things for setup! 
* If running local environment as a developer you will want to configure the `src/resources/global.js` manually to include the variables below. 
* If running the container image these below variables need to be configured in the container environment.

## Environment Variables
| Name | Example | Description |
|---|---|---|
| APP_BACKEND_URL | `https://proxy.bananaz.tech/api/configs/` | The URL for accessing the backend [MarketBotConfig API](https://github.com/BananazTechnology/market-bot-config-api-sb) |
| APP_BACKEND_API_KEY | `2JCt2Cj!qJx2ENvZh#7` | The API key which secures the API on the server |

## Built With
* [JavaScript](https://www.javascript.com/) - Programming language used
* [Bootstrap](https://www.bootstrapcdn.com/) - Front-end framework used
* [CSS](https://www.w3.org/TR/CSS/#css) - Stylesheet language used
* [HTML](https://html.spec.whatwg.org/) - Markup language used
