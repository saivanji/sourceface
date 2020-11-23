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
    'operation',
    'redirect'
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
    relations json,
    CONSTRAINT actions_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.actions OWNER TO admin;

--
-- Name: commands; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.commands (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    source_id integer NOT NULL,
    config json NOT NULL,
    CONSTRAINT commands_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.commands OWNER TO admin;

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

ALTER SEQUENCE public.commands_id_seq OWNED BY public.commands.id;


--
-- Name: layouts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.layouts (
    id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    positions json NOT NULL
);


ALTER TABLE public.layouts OWNER TO admin;

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
    layout_id uuid NOT NULL,
    CONSTRAINT modules_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.modules OWNER TO admin;

--
-- Name: modules_layouts; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.modules_layouts (
    module_id uuid NOT NULL,
    layout_id uuid NOT NULL
);


ALTER TABLE public.modules_layouts OWNER TO admin;

--
-- Name: pages; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.pages (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    route text NOT NULL,
    layout_id uuid NOT NULL,
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
-- Name: stale_commands; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.stale_commands (
    command_id integer NOT NULL,
    stale_id integer NOT NULL
);


ALTER TABLE public.stale_commands OWNER TO admin;

--
-- Name: commands id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.commands ALTER COLUMN id SET DEFAULT nextval('public.commands_id_seq'::regclass);


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

COPY public.actions (id, created_at, module_id, name, type, config, relations) FROM stdin;
8d8557a2-3bd7-41d6-bace-e89a61be093f	2020-11-02 19:54:30.655329	1a3c0c29-a473-473d-b744-6e609154a14a	\N	operation	{"queryId":10,"fields":[{"key":"limit","definition":{"type":"local","name":"limit"}},{"key":"offset","definition":{"type":"local","name":"offset"}}]}	{"commands":{"current": 10}}
17ebb990-8d6f-44c7-b6b1-cf75a52be7db	2020-11-02 20:10:23.069048	1a3c0c29-a473-473d-b744-6e609154a14a	test	operation	{"queryId":9,"foo":"bar"}	{"commands":{"current": 9}}
3df19c35-8f0a-4341-b2fb-acdae2053fb8	2020-11-23 13:05:49.424953	5dda5e74-7cba-4e4c-9db7-411dae2c6c0d	\N	redirect	{}	{"pages": {"current": 6}}
\.


--
-- Data for Name: commands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.commands (id, created_at, name, source_id, config) FROM stdin;
7	2020-10-25 15:41:01.204099	listOrders	1	{"value": "SELECT * FROM orders WHERE customer_name LIKE '{{search}}%' ORDER BY created_at DESC LIMIT {{limit}} OFFSET {{offset}}", "result": "many"}
8	2020-10-25 15:41:01.204099	createOrder	1	{"value": "INSERT INTO orders (customer_name, address, delivery_type, status, payment_type, amount, currency) VALUES ('{{customer_name}}', '{{address}}', '{{delivery_type}}', '{{status}}', '{{payment_type}}', {{amount}}, '{{currency}}') RETURNING *", "result": "single"}
9	2020-10-25 15:41:01.204099	countOrders	1	{"value":"SELECT count(id)::integer FROM orders","result":"single","compute":"result => result.count"}
10	2020-11-07 13:05:01.444378	getOrders	1	{"value": "SELECT * FROM orders ORDER BY created_at DESC LIMIT {{limit}} OFFSET {{offset}}", "result": "many"}
\.


--
-- Name: commands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.commands_id_seq', 10, true);


--
-- Data for Name: layouts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.layouts (id, created_at, positions) FROM stdin;
a3f2d2a9-e588-47be-853e-975ab124236b	2020-11-18 18:52:26.794869	{}
3c7b3140-88a3-41be-880c-bff74755ce48	2020-11-23 18:04:40.252231	{"04c08175-7961-4e22-9d33-cfe30943da8d": {"h": 1, "w": 4, "x": 0, "y": 3}, "3405d690-d444-4b86-91e4-d680aaada640": {"h": 1, "w": 4, "x": 0, "y": 5}, "4a278a03-3343-467b-816f-292358ab07dc": {"h": 1, "w": 4, "x": 0, "y": 2}, "5c557ec3-0744-4f8d-ae82-2335d566527d": {"h": 1, "w": 4, "x": 0, "y": 4}, "633210b9-b69a-46ac-8549-0f01c270156c": {"h": 1, "w": 4, "x": 0, "y": 1}, "705b2bd8-160f-4fe0-a926-6a71b3724272": {"h": 1, "w": 4, "x": 0, "y": 0}, "75d49b29-858e-4805-888b-aa31369d7a2b": {"h": 1, "w": 3, "x": 0, "y": 8}, "b62fd8b1-3d6b-4bd6-9a7a-49613a24b1c5": {"h": 1, "w": 4, "x": 0, "y": 6}, "f61d2948-9132-4006-ad32-b27470f88bc9": {"h": 1, "w": 4, "x": 0, "y": 7}}
1a3c0c29-a473-473d-b744-6e609154a14b	2020-11-02 18:15:37.692755	{"0e1ef8c6-d002-4e61-a1ce-7c7881f76c4f": {"h": 1, "w": 3, "x": 0, "y": 2}, "167c6d43-d066-4c31-9161-acc24de21abe": {"h": 1, "w": 3, "x": 7, "y": 1}, "1762f632-ee43-4571-9d81-a52a20c0074a": {"h": 1, "w": 3, "x": 7, "y": 3}, "18f429f3-68be-42f5-bf9d-ef70264c553f": {"h": 1, "w": 3, "x": 0, "y": 0}, "1a3c0c29-a473-473d-b744-6e609154a14a": {"h": 12, "w": 10, "x": 0, "y": 1}, "40147c57-cff4-4825-91ff-b74826ecc404": {"h": 1, "w": 3, "x": 0, "y": 0}, "425cb69b-0d31-43d4-9595-2100b4ca6d3b": {"h": 1, "w": 3, "x": 0, "y": 0}, "478213fd-856e-4771-86bc-40eed50ec34e": {"h": 1, "w": 3, "x": 7, "y": 3}, "4858d807-1269-479b-988c-f89bbfaa3567": {"h": 1, "w": 3, "x": 4, "y": 1}, "5dda5e74-7cba-4e4c-9db7-411dae2c6c0d": {"h": 1, "w": 2, "x": 8, "y": 0}, "60c4f48d-728e-48d5-a72f-4aa6cc8d0649": {"h": 1, "w": 3, "x": 7, "y": 0}, "7242c7e1-8816-43a4-8ba4-228eb5bc873b": {"h": 1, "w": 3, "x": 3, "y": 1}, "743e7170-7d02-4073-8709-cb79d9bcff31": {"h": 1, "w": 3, "x": 7, "y": 1}, "af6f58a4-8ae5-46d1-96b1-b7dc1547ea18": {"h": 1, "w": 3, "x": 0, "y": 0}, "bcc533f8-02d6-4454-98b4-289decdedbba": {"h": 1, "w": 3, "x": 7, "y": 0}, "bd76d4cb-efa3-4f20-b7df-0087cdddff6e": {"h": 1, "w": 3, "x": 6, "y": 0}, "c651babc-8c6a-4234-b402-a71c52941ec7": {"h": 1, "w": 3, "x": 0, "y": 0}, "c80f40e5-9feb-4f91-ba97-800d3624fbe4": {"h": 1, "w": 3, "x": 6, "y": 3}, "c96d1984-e787-4e03-8e26-7071dd4ed3d1": {"h": 1, "w": 3, "x": 7, "y": 0}, "cd95c664-2081-4e73-858f-6fcdc1bf0d85": {"h": 1, "w": 3, "x": 7, "y": 0}, "cf3cdfe3-de28-497d-a912-686f6247b951": {"h": 1, "w": 3, "x": 3, "y": 1}, "d10a9247-b116-4d58-9787-c3aafc9f40e3": {"h": 1, "w": 3, "x": 4, "y": 3}, "e6fc336d-aa2d-4aab-9897-fec3f2ef15e1": {"h": 1, "w": 3, "x": 7, "y": 1}, "e91a5239-e09b-4ce5-86b8-433d5e331705": {"h": 1, "w": 3, "x": 0, "y": 3}}
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migrations (data) FROM stdin;
{"lastRun": "1603133152443-actions.js", "migrations": [{"title": "1592490185949-sources.js", "timestamp": 1603640013218}, {"title": "1596634213008-layouts.js", "timestamp": 1603640013260}, {"title": "1596634748394-pages.js", "timestamp": 1603640013296}, {"title": "1596636642780-modules.js", "timestamp": 1603640013335}, {"title": "1603133152443-actions.js", "timestamp": 1603640013361}]}
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules (id, created_at, type, config, name, layout_id) FROM stdin;
1a3c0c29-a473-473d-b744-6e609154a14a	2020-11-02 18:57:03.7921	table	{"data":["8d8557a2-3bd7-41d6-bace-e89a61be093f"],"count":["17ebb990-8d6f-44c7-b6b1-cf75a52be7db"],"limit":10,"pagination":true}	table_1	1a3c0c29-a473-473d-b744-6e609154a14b
5dda5e74-7cba-4e4c-9db7-411dae2c6c0d	2020-11-23 13:05:37.041899	button	{"size": "regular", "text": "Create", "action": ["3df19c35-8f0a-4341-b2fb-acdae2053fb8"], "shouldFitContainer": false}	123	1a3c0c29-a473-473d-b744-6e609154a14b
4a278a03-3343-467b-816f-292358ab07dc	2020-11-23 19:16:36.588669	input	{"validationMessage":"Validation failed","placeholder":"Address"}	address	3c7b3140-88a3-41be-880c-bff74755ce48
04c08175-7961-4e22-9d33-cfe30943da8d	2020-11-23 19:16:36.589081	input	{"validationMessage":"Validation failed","placeholder":"Delivery type"}	delivery_type	3c7b3140-88a3-41be-880c-bff74755ce48
75d49b29-858e-4805-888b-aa31369d7a2b	2020-11-23 19:16:36.593492	button	{"text":"Create order","size":"regular","shouldFitContainer":false}	submit	3c7b3140-88a3-41be-880c-bff74755ce48
633210b9-b69a-46ac-8549-0f01c270156c	2020-11-23 18:22:24.486775	input	{"placeholder": "Customer name", "validationMessage": "Validation failed"}	customer_name	3c7b3140-88a3-41be-880c-bff74755ce48
f61d2948-9132-4006-ad32-b27470f88bc9	2020-11-23 19:16:36.600281	input	{"validationMessage":"Validation failed","placeholder":"Currency"}	currency	3c7b3140-88a3-41be-880c-bff74755ce48
5c557ec3-0744-4f8d-ae82-2335d566527d	2020-11-23 19:16:36.590732	input	{"validationMessage":"Validation failed","placeholder":"Status"}	status	3c7b3140-88a3-41be-880c-bff74755ce48
3405d690-d444-4b86-91e4-d680aaada640	2020-11-23 19:16:36.591114	input	{"validationMessage":"Validation failed","placeholder":"Payment type"}	payment_type	3c7b3140-88a3-41be-880c-bff74755ce48
b62fd8b1-3d6b-4bd6-9a7a-49613a24b1c5	2020-11-23 19:16:36.591588	input	{"validationMessage":"Validation failed","placeholder":"Amount"}	amount	3c7b3140-88a3-41be-880c-bff74755ce48
705b2bd8-160f-4fe0-a926-6a71b3724272	2020-11-23 19:18:58.835466	text	{"text":"Order creation","fontSize":"2xl","fontWeight":"semibold","alignmentX":"left","alignmentY":"baseline","decoration":"none","color":"#000"}	title	3c7b3140-88a3-41be-880c-bff74755ce48
\.


--
-- Data for Name: modules_layouts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules_layouts (module_id, layout_id) FROM stdin;
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pages (id, created_at, route, layout_id, title) FROM stdin;
4	2020-11-02 18:16:20.260669	/orders	1a3c0c29-a473-473d-b744-6e609154a14b	Orders list
5	2020-11-18 18:53:18.840502	/orders/:orderId	a3f2d2a9-e588-47be-853e-975ab124236b	Order edition
6	2020-11-23 18:05:41.944149	/orders/create	3c7b3140-88a3-41be-880c-bff74755ce48	Order creation
\.


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pages_id_seq', 6, true);


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
-- Data for Name: stale_commands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.stale_commands (command_id, stale_id) FROM stdin;
\.


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: commands commands_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.commands
    ADD CONSTRAINT commands_pkey PRIMARY KEY (id);


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
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: stale_commands stale_commands_command_id_stale_id_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.stale_commands
    ADD CONSTRAINT stale_commands_command_id_stale_id_key UNIQUE (command_id, stale_id);


--
-- Name: actions actions_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: commands commands_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.commands
    ADD CONSTRAINT commands_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.sources(id) ON DELETE CASCADE;


--
-- Name: modules modules_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_layout_id_fkey FOREIGN KEY (layout_id) REFERENCES public.layouts(id) ON DELETE CASCADE;


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
-- Name: pages pages_layout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pages
    ADD CONSTRAINT pages_layout_id_fkey FOREIGN KEY (layout_id) REFERENCES public.layouts(id) ON DELETE CASCADE;


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

