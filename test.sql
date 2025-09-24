SELECT
    SWITCH(
        MODE = 1,
        'Walk',
        MODE = 2,
        'Bike',
        MODE = 3,
        'Auto Driver',
        MODE = 4,
        'Auto Passenger',
        MODE = 5,
        'Transit Bus',
        MODE = 6,
        'Subway',
        True,
        'Other'
    ) AS TransportationMode,
    COUNT(*) AS TripCount,
    ROUND(
        (
            COUNT(*) * 100.0 / (
                SELECT
                    COUNT(*)
                FROM
                    LowincomeMAPCtrips
            )
        ),
        2
    ) AS PercentageOfTrips
FROM
    LowincomeMAPCtrips
GROUP BY
    SWITCH(
        MODE = 1,
        'Walk',
        MODE = 2,
        'Bike',
        MODE = 3,
        'Auto Driver',
        MODE = 4,
        'Auto Passenger',
        MODE = 5,
        'Transit Bus',
        MODE = 6,
        'Subway',
        True,
        'Other'
    )
ORDER BY
    COUNT(*) DESC;