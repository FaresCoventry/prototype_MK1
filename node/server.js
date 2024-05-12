const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const PdfPrinter = require('pdfmake');

const app = express();
const port = 3001; // Make sure no port conflicts with front end

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true 
}));
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
app.use(bodyParser.json()); // Parses JSON body data

mongoose.connect('mongodb+srv://fares:fares@proto1.mw2rqh7.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


app.get('/submit-prefs', (req, res) => {
    res.send('Hello World!');
  });
  

app.post('/submit-prefs', (req, res) => {
    console.log("Received preferences:", req.body);
    
    const pythonProcess = spawn('python', ['C:/Users/PC/Desktop/recommendsys1/python/recommend.py']);
  
    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();
  
    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });
  
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data.toString()}`);
    });
  
    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
      try {
        const parsedOutput = JSON.parse(pythonOutput);
        res.json(parsedOutput);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse Python script output' });
      }
    });
});

app.get('/get-recommendations', (req, res) => {
  const pythonProcess1 = spawn('python', ['C:/Users/PC/Desktop/prototype_MK1/python/testingRecs.py']);

  pythonProcess1.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      res.send(data.toString());
  });

  pythonProcess1.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send(data.toString());
  });

  pythonProcess1.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
    console.log('Server listening at port 3001');
});

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 
};


const fonts = {
  Roboto: {
    normal: 'C:/Users/PC/Desktop/fonts/Roboto-Regular.ttf',
    bold: 'C:/Users/PC/Desktop/fonts/Roboto-Medium.ttf',
    italics: 'C:/Users/PC/Desktop/fonts/Roboto-Italic.ttf',
    bolditalics: 'C:/Users/PC/Desktop/fonts/Roboto-MediumItalic.ttf'
  }
};


app.get('/api/generate-report/:id', cors(corsOptions), async (req, res) => {
  // const property = await fetchPropertyDirectly(req.params.id);
  const client = new MongoClient('mongodb+srv://fares:fares@proto1.mw2rqh7.mongodb.net/');
        await client.connect();
        const database = client.db("proto1");
        const properties = database.collection("props");
        const query = { id: parseInt(req.params.id, 10) };
        const property = await properties.findOne(query);
        // console.log(property);
        await client.close();

  console.log(property)
  if (!property) {
      return res.status(404).send('Property not found');
  }

  // Estimations
  const rentPerSquareMeter = 740;
  const annualExpenses = property.price * 0.01
  const appRate = 7
  const estimatedMonthlyRent = ((property.price + (property.price * 0.01)) * 0.01).toFixed(2);
  const annualRent = estimatedMonthlyRent * 12;
  const noi = (annualRent - annualExpenses).toFixed(2);
  const capRate = ((noi / property.price) * 100).toFixed(2);
  const grossRentalYield = ((annualRent / property.price) * 100).toFixed(2);
  const paybackPeriod = (property.price / (annualRent + (0.07 * property.price))).toFixed(2);
  const netRentalYield = (((annualRent - annualExpenses) / property.price) * 100).toFixed(2);
  const priceToEarning = (property.price / noi).toFixed(2);

  const docDefinition = {
    content: [
      {
        text: `Property Insight Report for ${property.id}`,
        style: 'header'
      },
      {
        style: 'tableExample',
        table: {
          widths: ['*', '*', '*', '*', '*'],
          body: [
            [
              {
                text: [
                  { text: 'Purchase Price:\n', bold: true },
                  `$${property.price || 0}`
                ],
                style: 'tableHeader'
              },
              {
                text: [
                  { text: 'Estimated Monthly Rent:\n', bold: true },
                  `$${estimatedMonthlyRent || 0}`
                ],
                style: 'tableHeader'
              },
              {
                text: [
                  { text: 'Net Operating Income:\n', bold: true },
                  `$${noi || 0}`
                ],
                style: 'tableHeader'
              },
              {
                text: [
                  { text: 'Gross Rental Yield:\n', bold: true },
                  `${grossRentalYield || 0}%`
                ],
                style: 'tableHeader'
              },
              {
                text: [
                  { text: 'Cap Rate:\n', bold: true },
                  `${capRate || 0}%`
                ],
                style: 'tableHeader'
              }
            ]
          ]
        },
        layout: 'noBorders'
      },
      // New section with columns
      {
        columns: [
          {
            // Left side with "Property Details" text
            width: '40%',
            stack: [
              {
                text: 'Property Details',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10]
              },
              {
                ul: [
                  `Bedrooms: ${property.beds || 'N/A'}`,
                  `Living rooms: ${property.livings || 'N/A'}`,
                  `Bathrooms: ${property.wc || 'N/A'}`,
                  `Area (Square Meters): ${property.area || 'N/A'}`,
                  `Kitchens: ${property.ketchen || 'N/A'}`,
                  `Furnished: ${property.furnished ? 'Yes' : 'No'}`,
                  `City: ${property.city || 'N/A'}`,
                  `District: ${property.district || 'N/A'}`
                ],
                style: 'detailsList'
              }
            ]
          },
          {
            // Right side with the image
            width: '60%',
            image: 'C:/Users/PC/Desktop/prototype_MK1/react-front/src/assets/smallproperty.jpg', // Adjust this path to the actual location
            width: 300, // Adjust based on desired image size
            alignment: 'right'
          }
        ]
      },
        {
          text: 'Key Investment Metrics Explained',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10]
      },
      {
        ul: [
          {
            text: 'Net Operating Income (NOI):',
            bold: true
          },
          'NOI is the total revenue from a property after deducting operating expenses. It reflects the property\'s profitability before debt and taxes. A higher NOI indicates better profitability.',
          'Recommended Range: 30-40% or higher.',
          {
            text: 'Gross Rental Yield:',
            bold: true
          },
          'Gross Rental Yield measures the return on investment based solely on rental income, without considering expenses. It helps assess a property\'s income potential relative to its cost.',
          'Recommended Range: 5-8% or higher.',
          {
            text: 'Capitalization Rate (Cap Rate):',
            bold: true
          },
          'Cap Rate is the ratio of a property\'s NOI to its market value, indicating its return on investment. It\'s a standardized way to compare property profitability.',
          'Recommended Range: 5-10%, depending on location and property type.'
        ],
        style: 'detailsList'
      },
      {
        columns: [
          {
            // Left side with "Property Details" text
            width: '80%',
            stack: [
              {
                text: 'Additional Metrics',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10]
              },
              {
                ul: [
                  `Payback Period: ${paybackPeriod} years`,
                  `Property Appreciation Rate: ${appRate || 0}% per year`,
                  `Net Rental Yield: ${netRentalYield || 0}%`,
                  `Price to Earnings Ratio: ${priceToEarning || 'N/A'}`,
                ],
                style: 'detailsList'
              }
            ]
          },
          {
            // Right side with the image
            width: '20%',
            image: 'C:/Users/PC/Desktop/prototype_MK1/react-front/src/assets/logoGP.png', // Adjust this path to the actual location
            width: 100, // Adjust based on desired image size
            alignment: 'right'
          }
        ]
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      tableHeader: {
        fillColor: '#eeeeee',
        margin: [0, 5, 0, 15]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
      sectionHeader: {
        fontSize: 16,
        bold: true
      },
      detailsList: {
        margin: [0, 5, 0, 5],
        fontSize: 12
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  };
  

  // PDF Generation
  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  pdfDoc.pipe(res);
  pdfDoc.end();
});



// async function fetchPropertyDirectly(id) {
//     const client = new MongoClient('mongodb+srv://fares:fares@proto1.mw2rqh7.mongodb.net/');
//     try {
//         await client.connect();
//         const database = client.db("proto1");
//         const properties = database.collection("props");
//         const query = { id: parseInt(id, 10) };
//         const property = await properties.findOne(query);
//         // console.log(property);
//     } finally {
//         await client.close();
//     }
// }


app.get('/api/properties/:id', async (req, res) => {
  const client = new MongoClient('mongodb+srv://fares:fares@proto1.mw2rqh7.mongodb.net/');
  const propertyId = parseInt(req.params.id); // Make sure to convert to the type expected by your DB (int or string)

  try {
    await client.connect();
    const database = client.db("proto1");
    const properties = database.collection("props");
    const query = { id: propertyId };
    const property = await properties.findOne(query);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error connecting to the database', error: err });
  } finally {
    await client.close();
  }
});