import { enablePromise, openDatabase } from "react-native-sqlite-storage";
import { entities } from "./models/index";

enablePromise(true);

const DATABASE_NAME = "eiedb";

export async function dbConnect() {
  const db = await openDatabase({ name: DATABASE_NAME, location: "default" });
  return db;
}

export async function createTables(
  db,
  table,
  fields,
  tableDeleted,
  primaryKey
) {
  let localFields = fields.join(",");
  fields = fields.join(" TEXT, \n");
  fields = `${fields} TEXT`;

  await db.transaction(async (t) => {
    await t.executeSql(`DROP TABLE IF EXISTS ${table}`, [], (tx, res) => {
      tableDeleted = true;
    });

    //CONSULTANDO SI ESTÁ BORRADO
    console.log(
      `*********** db/models/index ************* line 23 --BORRANDO TABLA LOCAL ${table}`
    );
    db.transaction(async (t) => {
      console.log("no no no");
      t.executeSql(
        `SELECT * FROM ${table}`,
        [],
        (tx, res) => {
          console.log(res.rows.length);
          if (res) {
            for (let i = 0; i < res.rows.length; i++) {
              console.log("RAWS", res.rows.item(i));
            }
          }
        },
        (err) => {
          console.log("ERROR" + err.message);
        }
      );
    });
  });

  await db.transaction(async (t) => {
    await t.executeSql(
      `CREATE TABLE IF NOT EXISTS ${table}(${fields}, ${
        primaryKey && `PRIMARY KEY(${primaryKey})`
      })`
    );
  });

  // console.log(
  //   `ALTER TABLE ${table} ADD PRIMARY KEY (${localFields.split(",")[0]})`
  // );
  // await db.transaction(async (t) => {
  //   await t.executeSql(
  //     `ALTER TABLE ${table} ADD PRIMARY KEY (${localFields.split(",")[0]})`
  //   );
  // });

  return tableDeleted;
}

// async function deleteFromTables(db, table) {
//   await db.transaction(async (t) => {
//     await t.executeSql(`DELETE FROM ${table}`);
//   });
// }

export async function syncTable(table, data, primaryKey) {
  //console.log("**********************************", data["globalDiscount"]);

  let tableDeleted = false;
  try {
    let db = await dbConnect();

    let fields = "";
    let fieldNames = Object.keys(data[table][0]);

    tableDeleted = await createTables(
      db,
      table,
      fieldNames,
      tableDeleted,
      primaryKey
    );
    console.log(tableDeleted);
    //await deleteFromTables(db, table);
    if (tableDeleted == true) {
      for (let i = 0; i < data[table].length; i++) {
        let validator = Object.keys(data[table][i]).length - 1;
        for (let o = 0; o <= validator; o++) {
          if (Object.keys(data[table][i]).length - 1 == o) {
            fields += "?";
          } else {
            fields += "?,";
          }
        }

        // await db.transaction(async (t) => {
        //   await t.executeSql(`DELETE FROM ${table}`);
        // });
        await db.transaction(async (t) => {
          await t.executeSql(
            `INSERT INTO ${table}(${Object.keys(data[table][i]).join(
              ","
            )}) VALUES(${fields})`,
            [...Object.values(data[table][i])]
          );
          fields = "";
        });
      }
    }

    db.transaction(async (t) => {
      t.executeSql(
        `SELECT * FROM ${table}`,
        [],
        (tx, res) => {
          console.log(res.rows.length);
          if (res) {
            for (let i = 0; i < res.rows.length; i++) {
              console.log("RAWS", res.rows.item(i));
            }
          }
        },
        (err) => {
          console.log("ERROR" + err.message);
        }
      );
    });

    return {
      error: false,
      body: data,
    };
  } catch (error) {
    throw error;
  }
}
//   Object.entries(entities).map(async (i) => {
//     let fields = i[1].fields.join(" TEXT, \n");
//     fields = `${fields} TEXT`;

//     console.log(`CRATE TABLE IF NOT EXISTS ${i[1].tableName}(${fields})`);
//     await db.transaction(async (t) => {
//       await t.executeSql(
//         `CREATE TABLE IF NOT EXISTS ${i[1].tableName}(${fields})`
//       );
//     });
//   });

//   await db.transaction(async (t) => {
//     await t.executeSql(
//       `INSERT INTO users(customer_id, first_name) values('1', 'jhon')`
//     );
//   });

// db.transaction(async (t) => {
//     console.log("no no no");
//     t.executeSql(
//       `SELECT * FROM users`,
//       [],
//       (tx, res) => {
//         console.log(res.rows.length);
//         if (res) {
//           for (let i = 0; i < res.rows.length; i++) {
//             console.log("RAWS", res.rows.item(i));
//           }
//         }
//       },
//       (err) => {
//         console.log("ERROR" + err.message);
//       }
//     );
//   });
