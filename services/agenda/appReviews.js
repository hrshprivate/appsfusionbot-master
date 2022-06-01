// const gplay = require('google-play-scraper')
// const store = require('app-store-scraper')
// const { COUNTRIES_ARRAY } = require('../../constants')
// const { AppReviews } = require('../../models')
// const { getAppId } = require('../../utils/checkTermLength')

// module.exports = function (agenda) {
//   agenda.define('app-reviews', async (job) => {
//     try {
//       //console.log("REVIEWS - ",job.attrs.data.appId)
//       const { appId, reviewsId, store: storeName } = job.attrs.data
//       const appReviews = await AppReviews.findOne({ id: reviewsId })
//       const appIdForSearch = await getAppId(appId)
//       let reviewsAll = []
//       let reviewsCount = 0
//       for (let country of COUNTRIES_ARRAY) {
//         //console.log(country[0])
//         let reviews
//         let app
//         if (storeName === 'AS') {
//           const appIdForSearch = await getAppId(appId)
//           try {
//             for (let page = 1; page <= 3; page++) {
//               try {
//                 await timer(3000)
//                 const response = await store.reviews({
//                   appId: appIdForSearch,
//                   page: page,
//                   country: country[0],
//                 })
//                 reviewsAll.push(...response)
//                 if (!response.length) break
//               } catch (err) {
//                 console.log('ERROR REVIEWS AS')
//               }
//             }
//             await timer(3000)
//             app = await store.app({
//               appId: appIdForSearch,
//               country: country[0],
//             })
//             if (reviewsAll.length && appReviews.reviews.length == 0) {
//               await updateReviews(reviewsId, reviewsAll, storeName, null)
//             }
//             console.log(reviewsAll.length, app?.title)
//           } catch (err) {
//             console.log('ERROR APP AS', country[0])
//           }
//         } else {
//           try {
//             await timer(1000)
//             app = await gplay.app({
//               appId: appIdForSearch,
//               country: country[1],
//             })
//             await timer(1000)
//             reviews = await gplay.reviews({
//               appId: appIdForSearch,
//               num: 150,
//               country: country[1],
//             })
//             if (reviews?.data[0]?.id !== reviewsAll[0]?.id)
//               reviewsAll.push(...reviews?.data)
//             if (reviewsAll.length && appReviews.reviews.length == 0) {
//               await updateReviews(reviewsId, reviewsAll, storeName, null)
//             }
//           } catch (err) {
//             console.log('ERROR GS')
//           }
//         }
//         let numReviews = app?.reviews || 0
//         console.log(
//           country[0],
//           app?.reviews,
//           numReviews,
//           appIdForSearch,
//           storeName
//         )
//         reviewsCount += numReviews
//       }

//       await updateReviews(reviewsId, reviewsAll, storeName, reviewsCount)
//     } catch (err) {
//       console.log(err)
//     }
//   })
// }

// async function updateReviews(reviewsId, reviewsAll, storeName, reviewsCount) {
//   // take the available in the database
//   const oldReviews = await AppReviews.findOne({ id: reviewsId })

//   // returns properties of interest from new
//   const updatedReviews = usefulProperties(reviewsAll)

//   // compare old with updated and pick up new ones
//   const newReviews = searchNewReviews(oldReviews.reviews, updatedReviews)

//   // sorting
//   const sortedReviews = sortReviews(newReviews, updatedReviews, storeName)

//   await AppReviews.findOneAndUpdate(
//     { _id: reviewsId },
//     { reviews: sortedReviews, reviewsCount },
//     { returnOriginal: false }
//   )
// }

// function usefulProperties(reviewsAll) {
//   return reviewsAll.map((elem) => {
//     return {
//       id: elem.id,
//       title: elem.title,
//       score: elem.score,
//       text: elem.text,
//       version: elem.version,
//       date: elem.date,
//       userName: elem.userName,
//     }
//   })
// }

// function searchNewReviews(oldAppReviews, updatedReviews) {
//   const newReviews = []
//   updatedReviews.forEach((updatedRev) => {
//     let isSame = false
//     for (let oldRev of oldAppReviews) {
//       if (oldRev.id === updatedRev.id) {
//         isSame = true
//         break
//       }
//     }
//     if (!isSame) newReviews.push(updatedRev)
//   })
//   return newReviews
// }

// // sorting by time (google).
// // combining new with updated.
// // new ones are moved forward, new ones are removed from updated (apple)
// function sortReviews(newReviews, updatedReviews, store) {
//   let sortedReviews
//   if (store === 'AS') {
//     for (let review of newReviews) {
//       const idx = updatedReviews.indexOf(review)
//       updatedReviews.splice(idx, 1)
//     }
//     sortedReviews = newReviews.concat(updatedReviews)
//   } else {
//     sortedReviews = updatedReviews
//       .map((elem) => {
//         elem.date = new Date(elem.date)
//         return elem
//       })
//       .sort((a, b) => b.date - a.date)
//   }
//   return sortedReviews
// }

// const timer = (ms) => new Promise((res) => setTimeout(res, ms))
