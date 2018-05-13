# Reader: Properties

Extracts all values from the properties file. Ignores empty lines and comment lines (`#` and `!`).
Supports multi-line properties. 

Note: properties files are popular in Java world.

![Version](https://img.shields.io/npm/v/@resource-sentry/reader-properties.svg)
![Dependencies](https://david-dm.org/resource-sentry/reader-properties.svg)

## Installation

> yarn add --dev @resource-sentry/reader-properties

## Configuration

- `entry`, path to a Properties file.

## Example

```
# File: "my-demo.properties"
hello:world
easyCount = 8
```

Properties will be compiled into `rs.js` file ready for use in production code.

```js
import Rs from './rs';

Rs.getResource(Rs.Text.HELLO); // Returns "world"
Rs.getResource(Rs.Value.EASY_COUNT); // Returns 8
```
