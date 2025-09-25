# Assignment 3: GIS

Dustin Michels
UEP 235 - Adv GIS
Sep 24, 2025

❗️ _NOTE:_ SQL code can be copied if you hover over the block :)

## Question 1: SQL Queries in Access

### (A) What is the average household size for low-income households in the MAPC region?

Code:

```sql
SELECT AVG(HHSIZ) AS avg_household_size
FROM HH
WHERE INCOME < 4;
```

Output:

| avg_household_size |
| :----------------- |
| 1.69566457501426   |

### (B) What is the average age of women versus men in low-income households in the MAPC region where the person reported their age (exclude records when AGE=99 or 0)?

Code:

```sql
SELECT
    SWITCH(
        PER.GEND = 1, "Male",
        PER.GEND = 2, "Female",
        PER.GEND = 9, "Refused"
    ) AS gender,
    AVG(PER.AGE) AS average_age
FROM HH, PER
WHERE (HH.SAMPN = PER.SAMPN)
    AND (HH.MPO = "MAPC")
    AND (HH.INCOME < 4)
    AND (PER.AGE <> 99 AND PER.AGE <> 0)
GROUP BY PER.GEND;
```

Output:

| gender | average_age      |
| :----- | :--------------- |
| Male   | 46.6310043668122 |
| Female | 50.0327635327635 |

### (C) What is the average trip duration for low-income women versus low-income men living in the MAPC region who reported their trip duration?

Code:

```sql
SELECT
    Switch(
        GEND = 1, "Male",
        GEND = 2, "Female",
        GEND = 9, "Refused",
    ) AS gender,
    AVG(TRPDUR) AS average_trip_duration
FROM
    LowincomeMAPCtrips
WHERE
    TRPDUR > 0
GROUP BY
    LowincomeMAPCtrips.GEND;
```

Output:

| gender | average_trip_duration |
| :----- | :-------------------- |
| Male   | 16.1498731842287      |
| Female | 15.7362163768762      |

### (D) What percentage of trips made by low-income households in MAPC region were by transit Bus, Subway, Walk, Bike, Auto driver and Auto passenger?

Code:

```sql
SELECT
    SWITCH(
        MODE = 1, 'Walk',
        MODE = 2, 'Bike',
        MODE = 3, 'Auto Driver',
        MODE = 4, 'Auto Passenger',
        MODE = 5, 'Transit Bus',
        MODE = 6, 'Subway',
        True, 'Other'
    ) AS transportation_mode,
    COUNT(*) AS trip_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM LowincomeMAPCtrips)), 2) AS percentage_of_trips
FROM LowincomeMAPCtrips
GROUP BY SWITCH(
        MODE = 1, 'Walk',
        MODE = 2, 'Bike',
        MODE = 3, 'Auto Driver',
        MODE = 4, 'Auto Passenger',
        MODE = 5, 'Transit Bus',
        MODE = 6, 'Subway',
        True, 'Other'
    )
ORDER BY COUNT(*) DESC;
```

Output:

| transportation_mode | trip_count | percentage_of_trips |
| :------------------ | :--------- | :------------------ |
| Walk                | 4090       | 30.45               |
| Auto Driver         | 3338       | 24.85               |
| Other               | 2770       | 20.62               |
| Auto Passenger      | 1197       | 8.91                |
| Transit Bus         | 1176       | 8.76                |
| Subway              | 729        | 5.43                |
| Bike                | 131        | 0.98                |

![chart](https://docs.google.com/spreadsheets/d/e/2PACX-1vTfIeoAAmBpcwKe19b_FAj4szhgk3B6lI0ioN72BDV1-daGdDKzc_7SQchliNwbpgZJr1swHici1E0w/pubchart?oid=1524727642&format=image)

_Figure 1:_ Number of trips made by various transportation modes by low-income households in the MAPC region based on Massachusetts Travel Survey.

> We see 30.45% of trips are done by walking. This is much higher than the overall average of 19%. This shows low income folks in the MAPC dataset walk more often than the general population.

### (E) What is the average trip duration of a walk trip made by women over the age of 65 in low-income households in the MAPC region versus the walk trip made by men over the age of 65?

Code:

```sql
SELECT
    Switch(
        GEND = 1, "Male",
        GEND = 2, "Female",
        GEND = 9, "Refused"
    ) AS gender,
    AVG(TRPDUR) AS average_trip_duration
FROM LowincomeMAPCtrips
WHERE MODE = 1
    AND AGE > 65
    AND AGE <> 99
    AND TRPDUR > 0
GROUP BY LowincomeMAPCtrips.GEND;
```

Output:

| gender | average_trip_duration |
| :----- | :-------------------- |
| Male   | 8.86127167630058      |
| Female | 9.25738396624473      |

## Question 2: Spatial or Select by Location Queries in ArcGIS Pro (2 points)

### (A) Attach a spatial/ select by location query about the travel patterns of low-income households in the MAPC region.

I selected trips where the trip-goer was the driver using select by attribute tool.

Of 13,396 trips taken by low-income households in the MAPC region, 3,325 were made by a driver (mode 3). This is the same 24% number I got earlier.

I made this into a separate layer.

Then I compared how many of those trips are within ½ mile of an MBTA bus stop vs. how many are more than ½ mile away, using the select by location tool.

![](https://i.ibb.co/BVt9ktj1/Screenshot-2025-09-24-at-10-26-16-PM.png)

I was wondering if people are less likely to drive if they live near a bus stop.

It seems driving trips are more likely to originate near a bus stop than not. However, I'm not sure how to make sense of this, since the majority of trips taken overall in the MAPC dataset are within ½ mile of a bus stop (81%).

If a random trip has an 81% chance of being within ½ mile of a bus stop, and a driving trip has a 59% chance of being within ½ mile of a bus stop, maybe being near a bus stop does make you less likely to drive?

It's getting too late to think...

### (B) Compare the average trip duration within ½ or ¼ mile of an MBTA bus stop (MBTABUSSTOPS.shp) to the average trip duration of all low-income households in MAPC?

![](https://i.ibb.co/fV7m8qzd/Screenshot-2025-09-24-at-10-48-07-PM.png)

## Additional Analysis

I wondered if men are generally willing to bike more often or further than women.

In the general data:

```sql
SELECT
    Switch(
        PER.GEND = 1, "Male",
        PER.GEND = 2, "Female",
        True, "Undefined"
    ) AS Gender,
    COUNT(*) AS Number_of_Bicycle_Trips,
    AVG(PLACE.TRPDUR) AS Average_Duration_Minutes
FROM
    PLACE,
    PER
WHERE
    PLACE.SAMPN = PER.SAMPN
    AND PLACE.PERNO = PER.PERNO
    AND PLACE.MODE = 2
    AND PLACE.PLANO > 1
    AND PLACE.TRPDUR IS NOT NULL
GROUP BY
    PER.GEND
```

| Gender | Number_of_Bicycle_Trips | Average_Duration_Minutes |
| :----- | :---------------------- | :----------------------- |
| Male   | 1124                    | 20.3781138790036         |
| Female | 555                     | 19.0126126126126         |

> In the complete sample, men take nearly twice as many bike trips as women, but the duration in minutes is nearly the same.

In the low-income MAPC data:

```sql
SELECT
    Switch(
        GEND = 1, "Male",
        GEND = 2, "Female",
        True, "Undefined"
    ) AS Gender,
    COUNT(*) AS Number_of_Bicycle_Trips,
    AVG(TRPDUR) AS Average_Duration_Minutes
FROM LowincomeMAPCtrips
WHERE MODE = 2
    AND TRPDUR > 0
GROUP BY GEND;
```

| Gender | Number_of_Bicycle_Trips | Average_Duration_Minutes |
| :----- | :---------------------- | :----------------------- |
| Male   | 77                      | 18.6753246753247         |
| Female | 54                      | 20.462962962963          |

> In the low-income MAPC dataset, women take a slightly longer average bike trip than men. Interesting! Here the sample size is also smaller.
