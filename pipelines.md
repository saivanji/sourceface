(query)["deleteOrder" with "id: 4"]
|
(notification)[show "Order was deleted successfully"]
|
(module)[for "deleteModal" call "close"]
|
(redirect)[to "/orders"]

(module)[for every "form_*" call "justify"]
|
(query)["createOrder" with "pipes.1"]
|
(redirect)[to "/orders/" with "pipes.2.id"]

(module)[from "ordersList" get "page"]

> When creating a new action, there will be "+" button which will suggest all possible next things could be applied.
