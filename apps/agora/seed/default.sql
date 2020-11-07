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
    id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    module_id uuid NOT NULL,
    name text,
    type public.action NOT NULL,
    config json NOT NULL,
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

COPY public.actions (id, created_at, module_id, name, type, config) FROM stdin;
17ebb990-8d6f-44c7-b6b1-cf75a52be7db	2020-11-02 20:10:23.069048	1a3c0c29-a473-473d-b744-6e609154a14a	\N	runQuery	{"queryId":9}
8d8557a2-3bd7-41d6-bace-e89a61be093f	2020-11-02 19:54:30.655329	1a3c0c29-a473-473d-b744-6e609154a14a	\N	runQuery	{"queryId":10,"fields":[{"key":"limit","definition":{"type":"local","name":"limit"}},{"key":"offset","definition":{"type":"local","name":"offset"}}]}
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
1a3c0c29-a473-473d-b744-6e609154a14b	2020-11-02 18:15:37.692755	{"1a3c0c29-a473-473d-b744-6e609154a14a":{"w":10,"h":12,"x":0,"y":1}}
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
\.


--
-- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pages_id_seq', 4, true);


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

