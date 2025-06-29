--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

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
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: routeuser
--

CREATE FUNCTION public.update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: routes; Type: TABLE; Schema: public; Owner: routeuser
--

CREATE TABLE public.routes (
    id integer NOT NULL,
    origin character varying(100) NOT NULL,
    destination character varying(100) NOT NULL,
    price numeric(10,2),
    departure_date timestamp with time zone,
    return_date timestamp with time zone,
    airline character varying(100),
    flight_number character varying(20),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.routes OWNER TO postgres;

--
-- Name: routes_id_seq; Type: SEQUENCE; Schema: public; Owner: routeuser
--

CREATE SEQUENCE public.routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.routes_id_seq OWNER TO postgres;

--
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: routeuser
--

ALTER SEQUENCE public.routes_id_seq OWNED BY public.routes.id;


--
-- Name: routes id; Type: DEFAULT; Schema: public; Owner: routeuser
--

ALTER TABLE ONLY public.routes ALTER COLUMN id SET DEFAULT nextval('public.routes_id_seq'::regclass);


--
-- Data for Name: routes; Type: TABLE DATA; Schema: public; Owner: routeuser
--

COPY public.routes (id, origin, destination, price, departure_date, return_date, airline, flight_number, created_at, updated_at) FROM stdin;
\.


--
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: routeuser
--

SELECT pg_catalog.setval('public.routes_id_seq', 1, false);


--
-- Name: routes routes_origin_destination_departure_date_flight_number_key; Type: CONSTRAINT; Schema: public; Owner: routeuser
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_origin_destination_departure_date_flight_number_key UNIQUE (origin, destination, departure_date, flight_number);


--
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: public; Owner: routeuser
--

ALTER TABLE ONLY public.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- Name: idx_routes_departure_date; Type: INDEX; Schema: public; Owner: routeuser
--

CREATE INDEX idx_routes_departure_date ON public.routes USING btree (departure_date);


--
-- Name: idx_routes_origin_destination; Type: INDEX; Schema: public; Owner: routeuser
--

CREATE INDEX idx_routes_origin_destination ON public.routes USING btree (origin, destination);


--
-- Name: routes update_routes_modtime; Type: TRIGGER; Schema: public; Owner: routeuser
--

CREATE TRIGGER update_routes_modtime BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();


--
-- PostgreSQL database dump complete
--

