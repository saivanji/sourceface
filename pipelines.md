> delete order

(module){orderId}[from `ordersList` get `selectedRow`]
|
(query)[run `deleteOrder` with `id` as `orderId`]
|
(notification)[show `Order was deleted successfully`]
|
(module)[for `deleteModal` call `close`]
|
(redirect)[to `/orders`]

---

> create order

(module){form}[for every `form_*` call `justify`]
|
(query){order}[run `createOrder` with `form`]
|
(redirect)[to `/orders/` with `order.id`]

---

> update order

(module){form}[for every `form_*` call `justify`]
|
(page){orderId}[get param `id`]
|
(query){order}[run `updateOrder` with `id` as `orderId` and `form`]
|
(debug)[`orderId` and `form`]
|
(notification)[show `Order` with `order.id` with `was updated successfully`]

---

> redirect to edit page from table row

(redirect)[to `/orders/` with `input.id`]

---

> list orders

(module){pagination}[from self get combined `limit` and `offset`]
|
(query)[run `listOrders` with `pagination`]

---

(module)[from `ordersList` get `page`]

> When creating a new action, there will be "+" button which will suggest all possible next things could be applied.
