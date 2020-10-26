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
    'runQuery'
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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.actions (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    module_id integer NOT NULL,
    name text,
    type public.action NOT NULL,
    config json NOT NULL,
    CONSTRAINT actions_name_check CHECK ((name <> ''::text))
);


ALTER TABLE public.actions OWNER TO admin;

--
-- Name: actions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actions_id_seq OWNER TO admin;

--
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.actions_id_seq OWNED BY public.actions.id;


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
    name text NOT NULL,
    CONSTRAINT modules_name_check CHECK ((name <> ''::text))
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
-- Name: actions id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.actions ALTER COLUMN id SET DEFAULT nextval('public.actions_id_seq'::regclass);


--
-- Name: commands id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.commands ALTER COLUMN id SET DEFAULT nextval('public.commands_id_seq'::regclass);


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
-- Name: sources id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.sources ALTER COLUMN id SET DEFAULT nextval('public.sources_id_seq'::regclass);


--
-- Data for Name: actions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.actions (id, created_at, module_id, name, type, config) FROM stdin;
9	2020-10-25 16:34:28.58102	1	\N	runQuery	{"query_id":7}
10	2020-10-25 17:24:05.010147	1	\N	runQuery	{"query_id":9}
\.


--
-- Name: actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.actions_id_seq', 10, true);


--
-- Data for Name: commands; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.commands (id, created_at, name, source_id, config) FROM stdin;
7	2020-10-25 15:41:01.204099	listOrders	1	{"value": "SELECT * FROM orders WHERE customer_name LIKE '{{search}}%' ORDER BY created_at DESC LIMIT {{limit}} OFFSET {{offset}}", "result": "many"}
8	2020-10-25 15:41:01.204099	createOrder	1	{"value": "INSERT INTO orders (customer_name, address, delivery_type, status, payment_type, amount, currency) VALUES ('{{customer_name}}', '{{address}}', '{{delivery_type}}', '{{status}}', '{{payment_type}}', {{amount}}, '{{currency}}') RETURNING *", "result": "single"}
9	2020-10-25 15:41:01.204099	countOrders	1	{"value":"SELECT count(id)::integer FROM orders","result":"single","compute":"result => result.count"}
\.


--
-- Name: commands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.commands_id_seq', 9, true);


--
-- Data for Name: layouts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.layouts (id, created_at) FROM stdin;
1	2020-10-25 15:41:38.951719
2	2020-10-25 15:43:15.198872
3	2020-10-25 15:43:15.198872
\.


--
-- Name: layouts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.layouts_id_seq', 1, false);


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.migrations (data) FROM stdin;
{"lastRun": "1603133152443-actions.js", "migrations": [{"title": "1592490185949-sources.js", "timestamp": 1603640013218}, {"title": "1596634213008-layouts.js", "timestamp": 1603640013260}, {"title": "1596634748394-pages.js", "timestamp": 1603640013296}, {"title": "1596636642780-modules.js", "timestamp": 1603640013335}, {"title": "1603133152443-actions.js", "timestamp": 1603640013361}]}
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules (id, created_at, position_id, type, config, name) FROM stdin;
1	2020-10-25 15:50:07.253689	1	table	{"limit":"10","pagination":true,"data":[8,9,10]}	table_1
2	2020-10-26 16:54:18.590493	2	table	{"limit":"5","pagination":true}	table_2
\.


--
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.modules_id_seq', 2, true);


--
-- Data for Name: modules_layouts; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.modules_layouts (module_id, layout_id) FROM stdin;
\.


--
-- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.pages (id, created_at, route, layout_id, title) FROM stdin;
1	2020-10-25 15:42:32.357993	/orders	1	Orders
2	2020-10-25 15:44:09.912236	/orders/create	2	Create order
3	2020-10-25 15:44:09.912236	/orders/:id	3	Order
\.


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pages_id_seq', 3, true);


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.positions (id, created_at, layout_id, "position") FROM stdin;
1	2020-10-25 15:48:17.106124	1	{"x":0,"y":0,"w":10,"h":11}
2	2020-10-26 16:53:17.372039	1	{"x":0,"y":11,"w":10,"h":11}
\.


--
-- Name: positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.positions_id_seq', 2, true);


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

