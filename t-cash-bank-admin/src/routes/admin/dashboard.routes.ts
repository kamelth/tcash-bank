import { Router, Request, Response } from 'express';
import { AppDataSource } from '../../config/data-source';

const router = Router();

// GET /admin/dashboard
router.get('/dashboard', async (req: any, res: Response) => {
  // 1. Most busy counter
  const busyRows: any[] = await AppDataSource.manager.query(`
    SELECT assigned_counter AS assignedCounter, COUNT(*) AS clientCount
    FROM queue
    GROUP BY assigned_counter
    ORDER BY clientCount DESC
    LIMIT 1
  `);
  const mostBusyCounter = busyRows[0] || { assignedCounter: null, clientCount: 0 };

  // 2. Most common client
  const clientRows: any[] = await AppDataSource.manager.query(`
    SELECT c.name AS name, COUNT(*) AS visitCount
    FROM queue q
    JOIN clients c ON q.client_id = c.client_id
    GROUP BY c.client_id
    ORDER BY visitCount DESC
    LIMIT 1
  `);
  const mostCommonClient = clientRows[0] || { name: null, visitCount: 0 };

  // 3. All‑time counter performance
  const perfAllTime: any[] = await AppDataSource.manager.query(`
    SELECT
      assigned_counter AS assignedCounter,
      COUNT(*) AS totalTickets,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completedTickets,
      IFNULL(AVG(TIMESTAMPDIFF(MINUTE, timestamp, completed_at)), 0) AS avgWaitTime,
      SUM(TIMESTAMPDIFF(MINUTE, timestamp, completed_at)) AS totalServiceTime
    FROM queue
    WHERE timestamp IS NOT NULL
    GROUP BY assigned_counter
    ORDER BY assigned_counter
  `);

  // build arrays for charts
  const counters = perfAllTime.map(r => {
    const name: string = r.assignedCounter;
    return name.startsWith('Counter ')
      ? `Counter ${name.slice(8)}`
      : name;
  });
  const totalTickets = perfAllTime.map(r => Number(r.totalTickets));
  const completedTickets = perfAllTime.map(r => Number(r.completedTickets));
  const avgWaitTimes = perfAllTime.map(r => Number(r.avgWaitTime) || 0);
  const totalServiceTimes = perfAllTime.map(r => Number(r.totalServiceTime) || 0);

  // summary cards all‑time
  const totalTicketsSum = totalTickets.reduce((a, b) => a + b, 0);
  const completedTicketsSum = completedTickets.reduce((a, b) => a + b, 0);
  const validWaits = avgWaitTimes.filter(w => w > 0);
  const avgWaitOverall = validWaits.length
    ? +(validWaits.reduce((a, b) => a + b, 0) / validWaits.length).toFixed(1)
    : 0;
  const activeCountersCount = perfAllTime.length;

  // 4. Today's performance
  const today = new Date().toISOString().slice(0, 10);
  const perfToday: any[] = await AppDataSource.manager.query(`
    SELECT
      assigned_counter AS assignedCounter,
      COUNT(*) AS totalTickets,
      COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completedTickets,
      AVG(TIMESTAMPDIFF(MINUTE, timestamp, completed_at)) AS avgWaitTime
    FROM queue
    WHERE DATE(timestamp) = ?
    GROUP BY assigned_counter
    ORDER BY assigned_counter
  `, [today]);

  let todayTotalTicketsSum = 0;
  let todayCompletedTicketsSum = 0;
  let todayWaitSum = 0;
  let todayWaitCount = 0;
  perfToday.forEach(r => {
    const tt = Number(r.totalTickets), ct = Number(r.completedTickets), wt = Number(r.avgWaitTime) || 0;
    todayTotalTicketsSum += tt;
    todayCompletedTicketsSum += ct;
    if (wt > 0) { todayWaitSum += wt; todayWaitCount++; }
  });
  const todayAvgWaitTime = todayWaitCount
    ? +(todayWaitSum / todayWaitCount).toFixed(1)
    : 0;

  res.render('admin/dashboard', {
    mostBusyCounter,
    mostCommonClient,
    perfAllTime,
    counters,
    totalTickets,
    completedTickets,
    avgWaitTimes,
    totalServiceTimes,
    totalTicketsSum,
    completedTicketsSum,
    avgWaitOverall,
    activeCountersCount,
    perfToday,
    todayTotalTicketsSum,
    todayCompletedTicketsSum,
    todayAvgWaitTime,
    year: new Date().getFullYear()
  });
});

export default router;
