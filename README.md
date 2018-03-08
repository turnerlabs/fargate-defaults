# Fargate Defaults

Query Datadog for metrics on a Harbor Shipment Environment in
order to get meaningful statistics for a Fargate migration.


## Endpoints

All endpoints use the same parameters.


#### Parameters

- `shipment` Shipment name

- `environment` Environment name

- `timeframe` Optional timeframe, defaults to `1d`. Valid tokens `1h`, `1d`, `1w`, and `1m`.


### GET `/v1/:shipment/:environment[/:timeframe]`

Returns an object describing the min and max values seen for the metric over the timeframe.

```json
{
  "namespace": "String, Kubernetes namespace (i.e., Shipment Environment)",
  "now": "Integer, POSIX timestamp at end of time series",
  "then": "Integer, POSIX timestamp at start of time series",
  "query": {
    "cpu": "String, the Datadog query that was made",
    "memory": "String, the Datadog query that was made"
  },
  "cpu": [
    {
      "min": "String, a percent value describing the minimum value found in the time series for a single replica",
      "max": "String, a percent value describing the maximum value found in the time series for a single replica"
    }
  ],
  "memory": [
    {
      "min": "String, a percent value describing the minimum value found in the time series for a single replica",
      "max": "String, a percent value describing the maximum value found in the time series for a single replica"
    }
  ]
}
```

### GET `/v1/:shipment/:environment[/:from-:to]`

This endpoint does not use the typical `:timeframe`, instead it offers the ability to pick a very specific
timeframe via `:from` and `:to`, which are both POSIX timestamp values.

- `from` Required POSIX timestamp for the start, or earlier date. `from` is a substitute for the offset between _now_ and _then_, where `from` is the exact date of _then_.

- `to` Required POSIX timestamp for the end, or later date. `to` is a substitute for _now_.

Returns an object describing the min and max values seen for the metric over the timeframe.

```json
{
  "namespace": "String, Kubernetes namespace (i.e., Shipment Environment)",
  "now": "Integer, POSIX timestamp at end of time series",
  "then": "Integer, POSIX timestamp at start of time series",
  "query": {
    "cpu": "String, the Datadog query that was made",
    "memory": "String, the Datadog query that was made"
  },
  "cpu": [
    {
      "min": "String, a percent value describing the minimum value found in the time series for a single replica",
      "max": "String, a percent value describing the maximum value found in the time series for a single replica"
    }
  ],
  "memory": [
    {
      "min": "String, a percent value describing the minimum value found in the time series for a single replica",
      "max": "String, a percent value describing the maximum value found in the time series for a single replica"
    }
  ]
}
```


### GET `/v1/cpu/:shipment/:environment[/:timeframe]`

Raw output of the query for CPU metric


### GET `/v1/ram/:shipment/:environment[/:timeframe]`

Raw output of the query for memory metric


## Author

Wilson Wise
