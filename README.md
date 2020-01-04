# Census Project Report
## Census Profile Demographics in the United States
The goal of this project was to prep data using Extract, Transform, Load (ETL) methodology to conduct a correlation analysis of the impact population count has on poverty count, age, and income.

We began the process by extracting the most valuable demographic data points from the United States Census Bureau, transforming the dataset and uploading the data into a Postgre SQL database for further analysis. Below was our process:

### Extract/Data Utilized
The demographic data was received from United States Census Bureau (https://www.census.gov). The US city, state data was directly dowloaded as a csv from publicopendatasoft.com based on zip code. More than 30,000 records were yielded from the API results of census data. 

### Transformation
Once the two data sets were extracted, the data was transformed using the csv and Python. Within the Census, any NANs, NA, or negative values were removed from the dataset. Columns were dropped from each dataset so only relevant data was left. Removing irrelevant data allowed for increased readability of the files. 

The following columns were used in in the transformation from the census dataset:

- Zip Code
- Population 
- Median Age 
- Per Capita Income 
- Poverty Count 

The following columns were removed in in the transformation from the csv dataset:

- TimeZone
- GeoPoint
- Daylight Savings Time Flag 
- Latitude
- Longtitude

 Next, columns we renamed columns headers (e.g. removed spaces from  headers and replaced with "_" underscores) after we combined the datasets. Additionally, the zip code header was modified to mirror the same in each dataset. We grouped the data based on city information. This was to ensure a successfull merge of data. Lastly, an inner merge was utilized to create one combined file. The census data was put into a dataframe and then into a csv using Pandas. Then the data was imported into a Postgre SQL database. We used a new JavaScript library called UNDERSCORE: UTILITY LIBRARIES to tranform the data. Underscore library was used for binding of data.  

### Load
Our data tables were loaded into a Postgre SQL database. The database allowed the ability to query the curated data tables and draw conclusions from the data.

### Next Steps
The next step in the process will be to further analyze the cleaned dataset to identify any trends or patterns that were common among US census data based on population.


### Visualize
A custom d3.js visualization was created of a scatter plot between variables population count vs poverty count, age, and income. Each city is representated with circle elements. State abbreviations are included in the circles. Additional labels are created in the scatter plot with given click events so that  users can decide which data to display. We used a combination of html and the js libraries d3 and underscore to create our interactive visualizations.

### Analyze
Our three hypothesis as follows:

H1: Areas with higher populations have a lower Median Age
H2: Per Capita Income is higher in places with higher populations
H3: Poverty count is higher within area with high populations


