--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.22
-- Dumped by pg_dump version 9.6.19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: admin
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: module; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.module AS ENUM (
    'button',
    'container',
    'input',
    'table',
    'text'
);


ALTER TYPE public.module OWNER TO admin;

--
-- Name: source; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.source AS ENUM (
    'postgres'
);


ALTER TYPE public.source OWNER TO admin;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: commands; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.commands (
    id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    source_id text NOT NULL,
    config json NOT NULL
);


ALTER TABLE public.commands OWNER TO admin;

--
-- Name: layouts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.layouts (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.layouts OWNER TO admin;

--
-- Name: layouts_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.layouts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.layouts_id_seq OWNER TO admin;

--
-- Name: layouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.layouts_id_seq OWNED BY public.layouts.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.migrations (
    data jsonb NOT NULL
);


ALTER TABLE public.migrations OWNER TO admin;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.modules (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    position_id integer NOT NULL,
    type public.module NOT NULL,
    config json NOT NULL,
    binds json
);


ALTER TABLE public.modules OWNER TO admin;

--
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.modules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modules_id_seq OWNER TO admin;

--
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.modules_id_seq OWNED BY public.modules.id;


--
-- Name: modules_layouts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.modules_layouts (
    module_id integer NOT NULL,
    layout_id integer NOT NULL
);


ALTER TABLE public.modules_layouts OWNER TO admin;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    route text NOT NULL,
    layout_id integer NOT NULL,
    title text NOT NULL,
    CONSTRAINT pages_title_check CHECK ((title <> ''::text))
);


ALTER TABLE public.pages OWNER TO admin;

--
-- Name: pages_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.pages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pages_id_seq OWNER TO admin;

--
-- Name: pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.pages_id_seq OWNED BY public.pages.id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.positions (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    layout_id integer NOT NULL,
    "position" json NOT NULL
);


ALTER TABLE public.positions OWNER TO admin;

--
-- Name: positions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.positions_id_seq OWNER TO admin;

--
-- Name: positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.positions_id_seq OWNED BY public.positions.id;


--
-- Name: sources; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sources (
    id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    type public.source NOT NULL,
    config json NOT NULL
);


ALTER TABLE public.sources OWNER TO admin;

--
-- Name: stale_commands; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.stale_commands (
    command_id text NOT NULL,
    stale_id text NOT NULL
);


ALTER TABLE public.stale_commands OWNER TO admin;

--
-- Name: layouts id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.layouts ALTER COLUMN id SET DEFAULT nextval('public.layouts_id_seq'::regclass);


--
-- Name: modules id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules ALTER COLUMN id SET DEFAULT nextval('public.modules_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: positions id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.positions ALTER COLUMN id SET DEFAULT nextval('public.positions_id_seq'::regclass);


--
-- Data for Name: commands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.commands (id, created_at, source_id, config) FROM stdin;
countOrders	2020-09-22 21:19:35.950308	pg	{"value":"SELECT count(id)::integer FROM orders","result":"single","compute":"result => result.count"}
createOrder	2020-10-02 18:56:11.256497	pg	{ "value": "INSERT INTO orders (customer_name, address, delivery_type, status, payment_type, amount, currency) VALUES ('{{customer_name}}', '{{address}}', '{{delivery_type}}', '{{status}}', '{{payment_type}}', {{amount}}, '{{currency}}') RETURNING *", "result": "single"}
listOrders	2020-09-22 21:19:35.950308	pg	{"value": "SELECT * FROM orders WHERE customer_name LIKE '{{search}}%' ORDER BY created_at DESC LIMIT {{limit}} OFFSET {{offset}}", "result": "many"}
\.


--
-- Data for Name: layouts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.layouts (id, created_at) FROM stdin;
1	2020-09-22 21:19:35.95544
2	2020-09-22 21:19:35.95544
3	2020-09-22 21:19:35.960813
4	2020-09-22 21:19:35.960813
5	2020-09-22 21:19:35.960813
6	2020-09-22 21:25:49.376417
7	2020-09-22 21:25:49.376417
8	2020-09-22 21:25:49.376417
9	2020-09-22 21:25:49.376417
10	2020-09-22 21:25:49.376417
11	2020-09-22 21:41:22.207006
12	2020-09-22 21:41:22.207006
13	2020-09-22 21:41:22.207006
14	2020-09-22 21:41:22.207006
15	2020-09-22 21:41:22.207006
\.


--
-- Name: layouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.layouts_id_seq', 15, true);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migrations (data) FROM stdin;
{"lastRun": "1596636642780-modules.js", "migrations": [{"title": "1592490185949-sources.js", "timestamp": 1600809575000}, {"title": "1596634213008-layouts.js", "timestamp": 1600809575026}, {"title": "1596634748394-pages.js", "timestamp": 1600809575058}, {"title": "1596636642780-modules.js", "timestamp": 1600809575097}]}
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules (id, created_at, position_id, type, config, binds) FROM stdin;
1	2020-09-22 21:19:35.960813	1	text	{"text":"Order creation","fontSize":"2xl","fontWeight":"semibold","alignmentX":"left","alignmentY":"baseline","decoration":"none","color":"#000"}	\N
3	2020-09-22 21:19:35.960813	3	input	{"placeholder":"Search for orders"}	\N
11	2020-09-22 21:19:35.960813	11	container	{"layoutId":5}	\N
12	2020-09-22 21:19:35.960813	12	container	{"layoutId":4}	\N
13	2020-09-22 21:19:35.960813	13	container	{"layoutId":3}	\N
2	2020-09-22 21:19:35.960813	2	text	{"text":"Orders list ({{ do queries.countOrders }})","fontSize":"2xl","fontWeight":"semibold","alignmentX":"left","alignmentY":"baseline","decoration":"none","color":"#000"}	\N
4	2020-09-22 21:19:35.960813	4	button	{"text":"Create new order","size":"regular","action":["-> do core.navigate to: '/orders/create'"],"shouldFitContainer":true}	\N
18	2020-09-24 21:03:39.974907	18	input	{"placeholder":"Payment type","validation":"^.+$","validationMessage":"Payment type is required"}	\N
5	2020-09-22 21:19:35.960813	5	table	{"items":["binds.orders"],"count":["do queries.countOrders"],"currentPage":["~page"],"limit":"10","pagination":true}	{"orders":"do queries.listOrders ~limit, ~offset, search: modules.3.value"}
21	2020-09-24 21:08:21.785715	21	button	{"text":"Create order","size":"regular","shouldFitContainer":false,"action":["-> do core.map data: binds.form, fn: 'justify'","prev -> do queries.createOrder ...prev","prev -> do core.navigate to: '/orders'"]}	{"form":{"customer_name":"modules.14","address":"modules.15","delivery_type":"modules.16","status":"modules.17","payment_type":"modules.18","amount":"modules.19","currency":"modules.23"}}
17	2020-09-24 21:02:57.096208	17	input	{"placeholder":"Status","validation":"^.+$","validationMessage":"Status is required"}	\N
23	2020-10-02 13:20:25.413223	23	input	{"validationMessage":"Currency is required","placeholder":"Currency","validation":"^.+$"}	\N
19	2020-09-24 21:04:06.307147	19	input	{"placeholder":"Amount","validation":"^[0-9]+\\\\.[0-9]+$","validationMessage":"Amount is required"}	\N
14	2020-09-24 20:55:45.399457	14	input	{"placeholder":"Customer name","validation":"^.+$","validationMessage":"Customer name is required"}	\N
15	2020-09-24 20:55:56.541161	15	input	{"placeholder":"Address","validation":"^.+$","validationMessage":"Address is required"}	\N
16	2020-09-24 20:56:54.89946	16	input	{"placeholder":"Delivery type","validation":"^.+$","validationMessage":"Delivery type is required"}	\N
\.


--
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.modules_id_seq', 24, true);


--
-- Data for Name: modules_layouts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules_layouts (module_id, layout_id) FROM stdin;
11	5
12	4
13	3
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pages (id, created_at, route, layout_id, title) FROM stdin;
1	2020-09-22 21:19:35.958246	/orders	1	Orders
5	2020-09-22 21:26:04.201303	/orders/create/a	3	a
6	2020-09-22 21:26:04.201303	/orders/create/a/b	4	b
7	2020-09-22 21:26:04.201303	/orders/create/a/b/c	5	c
8	2020-09-22 21:26:04.201303	/orders/edit	6	Edit order
9	2020-09-22 21:26:04.201303	/users	7	Users
2	2020-09-22 21:19:35.958246	/orders/create	2	Order creation
11	2020-09-22 21:42:30.673472	/:entity/create	9	Entity creation
10	2020-09-22 21:42:30.673472	/orders/:id	8	Order
\.


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pages_id_seq', 11, true);


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.positions (id, created_at, layout_id, "position") FROM stdin;
1	2020-09-22 21:19:35.960813	2	{"x":0,"y":0,"w":4,"h":1}
2	2020-09-22 21:19:35.960813	1	{"x":0,"y":0,"w":4,"h":1}
3	2020-09-22 21:19:35.960813	1	{"x":0,"y":1,"w":3,"h":1}
4	2020-09-22 21:19:35.960813	1	{"x":8,"y":1,"w":2,"h":1}
11	2020-09-22 21:19:35.960813	4	{"x":1,"y":1,"w":5,"h":5}
12	2020-09-22 21:19:35.960813	3	{"x":1,"y":3,"w":8,"h":6}
13	2020-09-22 21:19:35.960813	1	{"x":0,"y":16,"w":10,"h":8}
5	2020-09-22 21:19:35.960813	1	{"x":0,"y":2,"w":10,"h":11}
14	2020-09-24 20:55:45.399457	2	{"x":0,"y":1,"w":4,"h":1}
15	2020-09-24 20:55:56.541161	2	{"x":0,"y":2,"w":4,"h":1}
16	2020-09-24 20:56:54.89946	2	{"x":0,"y":3,"w":4,"h":1}
17	2020-09-24 21:02:57.096208	2	{"x":0,"y":4,"w":4,"h":1}
18	2020-09-24 21:03:39.974907	2	{"x":0,"y":5,"w":4,"h":1}
19	2020-09-24 21:04:06.307147	2	{"x":0,"y":6,"w":4,"h":1}
23	2020-10-02 13:20:25.413223	2	{"x":0,"y":7,"w":4,"h":1}
21	2020-09-24 21:08:21.785715	2	{"x":0,"y":8,"w":3,"h":1}
\.


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.positions_id_seq', 24, true);


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.sources (id, created_at, type, config) FROM stdin;
pg	2020-09-22 21:19:35.950308	postgres	{"connection":"postgresql://admin:admin@postgres_mock:5432/postgres"}
\.


--
-- Data for Name: stale_commands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.stale_commands (command_id, stale_id) FROM stdin;
createOrder	listOrders
createOrder	countOrders
\.


--
-- Name: commands commands_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.commands
    ADD CONSTRAINT commands_id_key UNIQUE (id);


--
-- Name: layouts layouts_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.layouts
    ADD CONSTRAINT layouts_pkey PRIMARY KEY (id);


--
-- Name: modules_layouts modules_layouts_layout_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules_layouts
    ADD CONSTRAINT modules_layouts_layout_id_key UNIQUE (layout_id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: modules modules_position_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_position_id_key UNIQUE (position_id);


--
-- Name: pages pages_layout_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_layout_id_key UNIQUE (layout_id);


--
-- Name: pages pages_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_pkey PRIMARY KEY (id);


--
-- Name: pages pages_route_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_route_key UNIQUE (route);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: sources sources_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_id_key UNIQUE (id);


--
-- Name: stale_commands stale_commands_command_id_stale_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_commands
    ADD CONSTRAINT stale_commands_command_id_stale_id_key UNIQUE (command_id, stale_id);


--
-- Name: commands commands_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.commands
    ADD CONSTRAINT commands_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE CASCADE;


--
-- Name: modules_layouts modules_layouts_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules_layouts
    ADD CONSTRAINT modules_layouts_layout_id_fkey FOREIGN KEY (layout_id) REFERENCES public.layouts(id) ON DELETE CASCADE;


--
-- Name: modules_layouts modules_layouts_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules_layouts
    ADD CONSTRAINT modules_layouts_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: modules modules_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id) ON DELETE CASCADE;


--
-- Name: pages pages_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_layout_id_fkey FOREIGN KEY (layout_id) REFERENCES public.layouts(id) ON DELETE CASCADE;


--
-- Name: positions positions_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_layout_id_fkey FOREIGN KEY (layout_id) REFERENCES public.layouts(id) ON DELETE CASCADE;


--
-- Name: stale_commands stale_commands_command_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_commands
    ADD CONSTRAINT stale_commands_command_id_fkey FOREIGN KEY (command_id) REFERENCES public.commands(id) ON DELETE CASCADE;


--
-- Name: stale_commands stale_commands_stale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_commands
    ADD CONSTRAINT stale_commands_stale_id_fkey FOREIGN KEY (stale_id) REFERENCES public.commands(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

