---
sidebar_position: 1
slug: /data/development/intro
---

# Structure:
A data integration pipeline consists of at least 2 microservices:
- Data collector: collects raw data and puts it on a message queue
- Transformer: 
	- listens to a message queue for raw data events
	- transforms the raw data into API calls to opendatahub-timeseries-writer (BDP)
So the flow will be  `Data provider -> Data collector -> Message Queue -> Transformer -> Timeseries writer`

Between data collector and transformer sits a raw data DB and API, the transformer only gets a notification event and has to request the actual raw data from the raw data API. This part is fully handled by the SDK.
	
# Repos:
	[Monorepo for data collectors and transformers](https://github.com/noi-techpark/opendatahub-collectors)
	[Repo of target writer API that transformers write to](https://github.com/noi-techpark/opendatahub-timeseries-writer)
	[Infrastructure repo with some docs and compose files](https://github.com/noi-techpark/infrastructure-v2)

# Data collector:
See https://github.com/noi-techpark/opendatahub-collectors/tree/main/collectors.  

All new data collectors are currently developed in golang.  
We provide a in-house SDK that simplifies development and standardizes concerns like telemetry, logging, and configuration.  

Attention: since the repo is evolving fast, some collectors are based on an outdated technology stack.  

Up to date are for example:
- parking-offstreet-famas (proprietary XMLRPC API)
- s3-poller (AWS S3)
- rest-multi-poller (includes some more complicated telemetry stuff)

When integrating a new data provider consider first if an already existing data collector can cover you use case or could with minor generic modifications.

Currently there is no boilerplate generator for data collectors, you will have to start from scratch or by copying an existing one (we suggest s3-poller for simplicity).
The wizard will ask you for a two part provider tuple and Origin, you can use placeholders during development, it's a configuration thing.

# Transformers
See https://github.com/noi-techpark/opendatahub-collectors/tree/main/transformers

Attention: since the repo is evolving fast, some collectors are based on an outdated technology stack.  

Up to date are for example:
- carsharing-alpsgo
- parking-offstreet-skidata
- meteorology-bz-forecast

For transformers we provide a (largely untested) boilerplate generator.
You can find it at `/transformers/boilerplate/setup_go.sh` and it generates a minimal transformer service that you can extend.

# Documentation writer API:
Some documentation about writing legacy style data collectors can be found [here](https://github.com/noi-techpark/opendatahub-docs/wiki/Getting-started-with-a-new-Data-Collector-development).  
The API has a [OpenAPI spec](https://swagger.opendatahub.com/?url=https://raw.githubusercontent.com/noi-techpark/bdp-core/main/openapi3.yml)  
While the data collector architecture has changed, the principles of interacting with the writer API still remain the same.

In golang, use the [go-bdp-client](https://github.com/noi-techpark/go-bdp-client) to interact with this API.
Still, the documentation might be useful to understand the underlying data structures and calls.  