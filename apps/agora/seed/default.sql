--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.19
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
-- Name: action; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.action AS ENUM (
    'debug',
    'function',
    'operation',
    'redirect',
    'selector'
);


ALTER TYPE public.action OWNER TO admin;

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

--
-- Name: jsonb_merge_recurse(jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.jsonb_merge_recurse(orig jsonb, delta jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
	select
		jsonb_object_agg(
			coalesce(keyOrig, keyDelta),
			case
				when valOrig isnull then valDelta
				when valDelta isnull then valOrig
				when (jsonb_typeof(valOrig) <> 'object' or jsonb_typeof(valDelta) <> 'object') then valDelta
				else jsonb_merge_recurse(valOrig, valDelta)
			end
		)
	from jsonb_each(orig) e1(keyOrig, valOrig)
	full join jsonb_each(delta) e2(keyDelta, valDelta) on keyOrig = keyDelta
$$;


ALTER FUNCTION public.jsonb_merge_recurse(orig jsonb, delta jsonb) OWNER TO admin;

--
-- Name: jsonb_recursive_merge(jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: admin
--

CREATE FUNCTION public.jsonb_recursive_merge(orig jsonb, delta jsonb) RETURNS jsonb
    LANGUAGE sql
    AS $$
        SELECT
          jsonb_object_agg(
            coalesce(keyOrig, keyDelta),
            CASE
              WHEN valOrig isnull THEN valDelta
              WHEN valDelta isnull THEN valOrig
              WHEN (jsonb_typeof(valOrig) <> 'object' OR jsonb_typeof(valDelta) <> 'object') THEN valDelta
              ELSE jsonb_recursive_merge(valOrig, valDelta)
            END
          )
        FROM jsonb_each(orig) e1(keyOrig, valOrig)
        FULL JOIN jsonb_each(delta) e2(keyDelta, valDelta) ON keyOrig = keyDelta
      $$;


ALTER FUNCTION public.jsonb_recursive_merge(orig jsonb, delta jsonb) OWNER TO admin;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.actions (
    id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    module_id uuid NOT NULL,
    name text,
    type public.action NOT NULL,
    config json NOT NULL,
    field text NOT NULL,
    "order" integer NOT NULL,
    CONSTRAINT actions_key_check CHECK ((field <> ''::text)),
    CONSTRAINT actions_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.actions OWNER TO admin;

--
-- Name: operations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.operations (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    source_id integer NOT NULL,
    config json NOT NULL,
    CONSTRAINT commands_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.operations OWNER TO admin;

--
-- Name: commands_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.commands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.commands_id_seq OWNER TO admin;

--
-- Name: commands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.commands_id_seq OWNED BY public.operations.id;


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
    id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    type public.module NOT NULL,
    config json NOT NULL,
    name text NOT NULL,
    page_id integer NOT NULL,
    parent_id uuid,
    "position" json,
    CONSTRAINT modules_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.modules OWNER TO admin;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    route text NOT NULL,
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
-- Name: references; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."references" (
    action_id uuid NOT NULL,
    page_id integer,
    operation_id integer,
    module_id uuid,
    field text NOT NULL,
    CONSTRAINT references_field_check CHECK ((field ~ '^[a-zA-Z]+/[0-9]+$'::text))
);


ALTER TABLE public."references" OWNER TO admin;

--
-- Name: sources; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.sources (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    type public.source NOT NULL,
    config json NOT NULL,
    CONSTRAINT sources_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.sources OWNER TO admin;

--
-- Name: sources_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.sources_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sources_id_seq OWNER TO admin;

--
-- Name: sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.sources_id_seq OWNED BY public.sources.id;


--
-- Name: stale_operations; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.stale_operations (
    command_id integer NOT NULL,
    stale_id integer NOT NULL
);


ALTER TABLE public.stale_operations OWNER TO admin;

--
-- Name: values; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."values" (
    key text NOT NULL,
    data text NOT NULL
);


ALTER TABLE public."values" OWNER TO admin;

--
-- Name: operations id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations ALTER COLUMN id SET DEFAULT nextval('public.commands_id_seq'::regclass);


--
-- Name: pages id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages ALTER COLUMN id SET DEFAULT nextval('public.pages_id_seq'::regclass);


--
-- Name: sources id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sources ALTER COLUMN id SET DEFAULT nextval('public.sources_id_seq'::regclass);


--
-- Data for Name: actions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.actions (id, created_at, module_id, name, type, config, field, "order") FROM stdin;
9ab1d4cf-e501-4fa8-b0ef-a861af55f6cb	2020-12-05 12:44:52.630975	1a3c0c29-a473-473d-b744-6e609154a14a	\N	operation	{"fields": [{"key": "limit", "definition": {"name": "limit", "type": "local"}}, {"key": "offset", "definition": {"name": "offset", "type": "local"}}], "groups": []}	data	0
59407f11-55a0-4968-9c7c-17d5702c1e81	2020-12-05 12:44:52.630632	1a3c0c29-a473-473d-b744-6e609154a14a	\N	operation	{}	count	1
e0693656-26ac-48ea-a23c-0ac7a35eca36	2020-12-09 12:25:08.435407	1a3c0c29-a473-473d-b744-6e609154a14a	\N	function	{}	currentPage	2
c450ae08-7409-4a75-853f-44e4a4d40e5f	2020-12-12 21:29:30.650449	38ec786b-2157-4f99-a964-8300363b9da4	\N	redirect	{}	action	3
9dad524a-18c0-429f-9eae-31658e5f7b6c	2020-12-12 21:55:05.78589	18ffc49f-d4af-4e32-b4f9-5755092f3f84	\N	redirect	{}	action	3
f1e03661-c824-40ef-bbae-6fc2543df2dc	2020-12-12 22:12:46.196887	4ac0ac8b-15dc-437a-af4f-2cf90255608a	form	function	{"func":"release"}	action	0
bdcb1720-b9f7-4000-81bb-6ee6104db34c	2020-12-12 22:27:37.242066	4ac0ac8b-15dc-437a-af4f-2cf90255608a	\N	operation	{}	action	1
6962e6e4-6dc0-441c-9d73-f6e62d7fd80e	2020-12-16 20:45:59.969758	2fd0278b-2bed-44d6-93e0-789fe235ca4c	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["customer_name"]}	initial	0
801ac681-f882-4f65-b2dc-7fa7d72f41b8	2020-12-16 20:50:42.127821	1e6a7554-9d5f-46fc-afb1-c35d4e316c5b	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["delivery_type"]}	initial	2
e91ea41b-8589-408c-b1a7-92643b540cd7	2020-12-16 20:50:42.128111	21df1eab-9e3f-4430-9094-32e3d99cd7d1	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["address"]}	initial	1
f44d8bd9-ecda-4da0-b63f-ce57caffb6e4	2020-12-16 20:52:02.144861	be867f4d-df4c-4e8c-b246-f459e713c1ab	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["amount"]}	initial	6
6530f888-4d29-4d72-813c-2a1dd13bd621	2020-12-16 20:52:02.146332	468ac0ed-3da0-4682-8021-1a0341716caf	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["currency"]}	initial	5
c074863d-8059-4106-b998-7e5f479e302c	2020-12-16 20:52:02.146586	150bea96-83a4-4700-847a-a473577a0f44	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["status"]}	initial	3
e538ab74-969f-4182-89fc-653e807b72c8	2020-12-16 20:52:02.146857	a29bfee2-22c2-48c7-b336-3dc9ab10150b	\N	selector	{"definition":{"type":"mount","moduleId":"5a7407cc-401f-47b5-8d8e-4fd94202023d"},"path":["payment_type"]}	initial	4
44a26176-f287-47d2-868d-f608954af9d6	2020-12-16 20:44:23.181596	5a7407cc-401f-47b5-8d8e-4fd94202023d	\N	operation	{"fields": [{"key": "id", "definition": {"key": "orderId", "type": "params"}}]}	@mount	0
\.


--
-- Name: commands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.commands_id_seq', 12, true);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migrations (data) FROM stdin;
{"lastRun": "1603133152443-actions.js", "migrations": [{"title": "1592490185949-sources.js", "timestamp": 1603640013218}, {"title": "1596634748394-pages.js", "timestamp": 1603640013296}, {"title": "1596636642780-modules.js", "timestamp": 1603640013335}, {"title": "1603133152443-actions.js", "timestamp": 1603640013361}]}
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules (id, created_at, type, config, name, page_id, parent_id, "position") FROM stdin;
1a3c0c29-a473-473d-b744-6e609154a14a	2020-12-04 21:40:09.514037	table	{"limit":10,"pagination":true}	table_1	8	\N	{"h":12,"w":10,"x":0,"y":1}
18ffc49f-d4af-4e32-b4f9-5755092f3f84	2020-12-12 15:23:38.735586	button	{"text":"Click me","size":"regular","shouldFitContainer":false}	abc	8	\N	{"w":3,"h":1,"x":0,"y":0}
38ec786b-2157-4f99-a964-8300363b9da4	2020-12-05 15:16:40.457933	button	{"size": "regular", "text": "Create order", "shouldFitContainer": false}	button	8	\N	{"h":1,"w":2,"x":8,"y":0}
be867f4d-df4c-4e8c-b246-f459e713c1ab	2020-12-16 20:40:39.578189	input	{"validationMessage":"Validation failed","placeholder":"Amount","validation":"^.+$"}	form_amount	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":6}
5a7407cc-401f-47b5-8d8e-4fd94202023d	2020-12-16 20:40:39.56404	container	{}	form	9	\N	{"w":10,"h":9,"x":0,"y":0}
4ac0ac8b-15dc-437a-af4f-2cf90255608a	2020-12-12 22:11:34.689155	button	{"text":"Submit","size":"regular","shouldFitContainer":false}	submit	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":3,"h":1,"x":0,"y":7}
ce5874ab-7c22-473a-9cff-8559bc91b4ec	2020-12-12 22:08:42.253396	input	{"validationMessage":"Validation failed","placeholder":"Customer name","validation":"^.+$"}	form_customer_name	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":0}
75dbe2c3-6fbe-42da-9a92-30cb5a75344e	2020-12-12 22:10:57.668111	input	{"validationMessage":"Validation failed","placeholder":"Status","validation":"^.+$"}	form_status	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":3}
be0d7480-f666-47d3-bb4f-f5afa805b80b	2020-12-12 22:10:57.668361	input	{"validationMessage":"Validation failed","placeholder":"Delivery type","validation":"^.+$"}	form_delivery_type	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":2}
424cff4f-0eb7-40aa-b5d6-756031c33ad4	2020-12-12 22:10:57.66854	input	{"validationMessage":"Validation failed","placeholder":"Address","validation":"^.+$"}	form_address	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":1}
d8f69376-21de-4e51-8fa7-faccd70034e6	2020-12-12 22:10:57.668828	input	{"validationMessage":"Validation failed","placeholder":"Payment type","validation":"^.+$"}	form_payment_type	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":4}
41941e89-d2ec-4c0f-a3d9-cece801df9f3	2020-12-12 22:10:57.669059	input	{"validationMessage":"Validation failed","placeholder":"Amount","validation":"^.+$"}	form_amount	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":6}
67923baf-7ab0-4237-8a6c-f5d97ab26eeb	2020-12-12 22:10:57.669291	input	{"validationMessage":"Validation failed","placeholder":"Currency","validation":"^.+$"}	form_currency	7	04192cf3-daaf-4156-b961-79a8fa6de888	{"w":4,"h":1,"x":0,"y":5}
04192cf3-daaf-4156-b961-79a8fa6de888	2020-12-12 22:32:04.944586	container	{}	form	7	\N	{"w":10,"h":9,"x":0,"y":0}
468ac0ed-3da0-4682-8021-1a0341716caf	2020-12-16 20:40:39.573488	input	{"validationMessage":"Validation failed","validation":"^.+$","placeholder":"Currency"}	form_currency	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":5}
150bea96-83a4-4700-847a-a473577a0f44	2020-12-16 20:40:39.575959	input	{"validationMessage":"Validation failed","placeholder":"Status","validation":"^.+$"}	form_status	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":3}
93760d88-0624-482a-b49d-a83fac1007aa	2020-12-16 20:41:05.474268	button	{"text":"Click me","size":"regular","shouldFitContainer":false}	submit	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":3,"h":1,"x":0,"y":7}
a29bfee2-22c2-48c7-b336-3dc9ab10150b	2020-12-16 20:41:59.450071	input	{"validationMessage":"Validation failed","placeholder":"Payment type","validation":"^.+$"}	form_payment_type	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":4}
1e6a7554-9d5f-46fc-afb1-c35d4e316c5b	2020-12-16 20:42:58.425407	input	{"validationMessage":"Validation failed","validation":"^.+$","placeholder":"Delivery type"}	form_delivery_type	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":2}
21df1eab-9e3f-4430-9094-32e3d99cd7d1	2020-12-16 20:43:13.294223	input	{"validationMessage":"Validation failed","placeholder":"Address","validation":"^.+$"}	form_address	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":1}
2fd0278b-2bed-44d6-93e0-789fe235ca4c	2020-12-16 20:43:39.261627	input	{"validationMessage":"Validation failed","placeholder":"Customer name","validation":"^.+$"}	form_customer_name	9	5a7407cc-401f-47b5-8d8e-4fd94202023d	{"w":4,"h":1,"x":0,"y":0}
\.


--
-- Data for Name: operations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.operations (id, created_at, name, source_id, config) FROM stdin;
7	2020-10-25 15:41:01.204099	listOrders	1	{"value": "SELECT * FROM orders WHERE customer_name LIKE '{{search}}%' ORDER BY created_at DESC LIMIT {{limit}} OFFSET {{offset}}", "result": "many"}
8	2020-10-25 15:41:01.204099	createOrder	1	{"value": "INSERT INTO orders (customer_name, address, delivery_type, status, payment_type, amount, currency) VALUES ('{{customer_name}}', '{{address}}', '{{delivery_type}}', '{{status}}', '{{payment_type}}', {{amount}}, '{{currency}}') RETURNING *", "result": "single"}
9	2020-10-25 15:41:01.204099	countOrders	1	{"value":"SELECT count(id)::integer FROM orders","result":"single","compute":"result => result.count"}
10	2020-11-07 13:05:01.444378	getOrders	1	{"value": "SELECT * FROM orders ORDER BY created_at DESC LIMIT {{limit}} OFFSET {{offset}}", "result": "many"}
12	2020-12-14 15:38:41.542949	getOrder	1	{"value": "SELECT * FROM orders WHERE id = {{id}}", "result": "single"}
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pages (id, created_at, route, title) FROM stdin;
7	2020-12-04 21:35:37.889485	/orders/create	Order creation
8	2020-12-04 21:36:01.552367	/orders	Orders list
9	2020-12-16 20:31:44.686672	/orders/:orderId	Edit order
\.


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pages_id_seq', 9, true);


--
-- Data for Name: references; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."references" (action_id, page_id, operation_id, module_id, field) FROM stdin;
9ab1d4cf-e501-4fa8-b0ef-a861af55f6cb	7	\N	\N	test/0
9ab1d4cf-e501-4fa8-b0ef-a861af55f6cb	8	\N	\N	test/1
9ab1d4cf-e501-4fa8-b0ef-a861af55f6cb	\N	10	\N	current/0
59407f11-55a0-4968-9c7c-17d5702c1e81	\N	9	\N	current/0
9dad524a-18c0-429f-9eae-31658e5f7b6c	7	\N	\N	current/0
c450ae08-7409-4a75-853f-44e4a4d40e5f	7	\N	\N	current/0
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	ce5874ab-7c22-473a-9cff-8559bc91b4ec	selected/0
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	75dbe2c3-6fbe-42da-9a92-30cb5a75344e	selected/1
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	424cff4f-0eb7-40aa-b5d6-756031c33ad4	selected/2
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	be0d7480-f666-47d3-bb4f-f5afa805b80b	selected/3
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	d8f69376-21de-4e51-8fa7-faccd70034e6	selected/4
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	41941e89-d2ec-4c0f-a3d9-cece801df9f3	selected/5
f1e03661-c824-40ef-bbae-6fc2543df2dc	\N	\N	67923baf-7ab0-4237-8a6c-f5d97ab26eeb	selected/6
bdcb1720-b9f7-4000-81bb-6ee6104db34c	\N	8	\N	current/0
44a26176-f287-47d2-868d-f608954af9d6	\N	12	\N	current/0
\.


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.sources (id, created_at, name, type, config) FROM stdin;
1	2020-10-25 15:37:08.613742	pg	postgres	{"connection":"postgresql://admin:admin@postgres_mock:5432/postgres"}
\.


--
-- Name: sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.sources_id_seq', 1, true);


--
-- Data for Name: stale_operations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.stale_operations (command_id, stale_id) FROM stdin;
8	10
8	9
\.


--
-- Data for Name: values; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."values" (key, data) FROM stdin;
schema	test
\.


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: operations commands_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations
    ADD CONSTRAINT commands_pkey PRIMARY KEY (id);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


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
-- Name: references references_action_id_field_module_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_action_id_field_module_id_key UNIQUE (action_id, field, module_id);


--
-- Name: references references_action_id_field_operation_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_action_id_field_operation_id_key UNIQUE (action_id, field, operation_id);


--
-- Name: references references_action_id_field_page_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_action_id_field_page_id_key UNIQUE (action_id, field, page_id);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: stale_operations stale_commands_command_id_stale_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_operations
    ADD CONSTRAINT stale_commands_command_id_stale_id_key UNIQUE (command_id, stale_id);


--
-- Name: actions unique_order_module_id_field; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT unique_order_module_id_field UNIQUE ("order", module_id, field);


--
-- Name: modules unique_page_id_name; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT unique_page_id_name UNIQUE (page_id, name);


--
-- Name: values values_key_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."values"
    ADD CONSTRAINT values_key_key UNIQUE (key);


--
-- Name: actions actions_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: operations commands_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.operations
    ADD CONSTRAINT commands_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE CASCADE;


--
-- Name: modules modules_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE CASCADE;


--
-- Name: modules modules_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: references references_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.actions(id) ON DELETE CASCADE;


--
-- Name: references references_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: references references_operation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_operation_id_fkey FOREIGN KEY (operation_id) REFERENCES public.operations(id) ON DELETE RESTRICT;


--
-- Name: references references_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."references"
    ADD CONSTRAINT references_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.pages(id) ON DELETE RESTRICT;


--
-- Name: stale_operations stale_commands_command_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_operations
    ADD CONSTRAINT stale_commands_command_id_fkey FOREIGN KEY (command_id) REFERENCES public.operations(id) ON DELETE CASCADE;


--
-- Name: stale_operations stale_commands_stale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_operations
    ADD CONSTRAINT stale_commands_stale_id_fkey FOREIGN KEY (stale_id) REFERENCES public.operations(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

