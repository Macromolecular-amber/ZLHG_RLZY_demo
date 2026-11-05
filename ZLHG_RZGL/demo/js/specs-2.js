/* 规格：考勤 / 薪酬 / 福利 / 绩效 */
(function () {
  const D2 = window.HR_DATA2;
  const H = window.HR_SPEC_HELP;

  function tbl(cols, rows) {
    return `<div class="table-wrap"><table class="hr-table"><thead><tr>${cols.map((c) => `<th${c.width ? ` style="width:${c.width}"` : ''}>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${c.render ? c.render(r) : H.esc(r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  /* ===== 排班管理 ===== */
  window.HR_SPEC_ADD({
    key: 'attendance-schedule', title: '排班管理',
    desc: '支持四班三运转、五班三运转等倒班模式自动排班；节假日、抢修、大修值班按区域与事项定人定责，值班签到与补贴自动结算。',
    metrics: [
      { label: '本月班次', value: '186', unit: '班次', note: '5 个班组 · 90 人', color: '#7659e7' },
      { label: '倒班人员', value: '90', unit: '人', note: '四班三运转 / 五班三运转', color: '#4389ed' },
      { label: '值班安排', value: '42', unit: '人次', note: '覆盖 7 家单位', cls: 'warn', color: '#e5a22a' },
      { label: '待排班次', value: '3', unit: '班', note: '节假日值班待审批', cls: 'danger', color: '#eb6262' }
    ],
    custom: () => {
      const shifts = tbl([
        { label: '班次名称', key: 'name', render: (r) => `<span class="strong">${H.esc(r.name)}</span>` },
        { label: '排班性质', key: 'nature', render: (r) => H.chip(r.nature, 'blue') },
        { label: '时间段', key: 'time' }, { label: '班组', key: 'team' }, { label: '班次津贴', key: 'allowance' },
        { label: '轮转周期', key: 'cycle' }, { label: '状态', render: (r) => H.statusTag(r.status) }
      ], D2.SHIFTS);
      const calendar = `<div class="calendar"><table><thead><tr><th>班组</th>${D2.SHIFT_MATRIX.days.map((d) => `<th>${d}</th>`).join('')}</tr></thead><tbody>
        ${D2.SHIFT_MATRIX.cells.map((row, i) => `<tr><td>${D2.SHIFT_MATRIX.groups[i]}</td>${row.map((c) => `<td>${c === '休' ? '<span class="shift-tag off">休</span>' : `<span class="shift-tag ${c === '甲班' ? 'a' : c === '中班' ? 'b' : 'c'}">${c}</span>`}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div>`;
      const duty = tbl([
        { label: '值班人员', key: 'name', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.unit)} · ${H.esc(r.dept)}</div></div>` },
        { label: '职称 / 技能', key: 'title' }, { label: '负责区域', key: 'area' }, { label: '负责事项', render: (r) => `<span class="sub">${H.esc(r.duty)}</span>` },
        { label: '值班日期', key: 'date' }
      ], D2.DUTY_ROSTER);
      return H.mcards([
        { label: '本月班次', value: '186', unit: '班次', note: '5 个班组 · 90 人', color: '#7659e7' },
        { label: '倒班人员', value: '90', unit: '人', note: '四班三运转 / 五班三运转', color: '#4389ed' },
        { label: '值班安排', value: '42', unit: '人次', note: '覆盖 7 家单位', cls: 'warn', color: '#e5a22a' },
        { label: '待排班次', value: '3', unit: '班', note: '节假日值班待审批', cls: 'danger', color: '#eb6262' }
      ]) + H.panel('倒班排班清单（按班组轮转 · 含班次性质与津贴标准）', shifts, '共 6 类班次 · 2026 年 11 月排班表已发布')
      + `<section class="panel-card"><div class="panel-header"><h3>11 月班组排班表（四班三运转）</h3><span class="panel-extra">8 天循环 · 每日同步考勤</span></div>${calendar}<p class="panel-note">甲班 08:00–16:00 / 中班 16:00–24:00 / 夜班 00:00–08:00，跨零点班次按起始日归集津贴；排班表可直接导出 Excel / PDF 供生产现场使用。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>值班管理清单（按日期排序）</h3><span class="panel-extra">本周 5 人</span></div>${duty}<p class="panel-note">节假日值班、抢修值班、大修期间值班按区域与事项定人；签到与补贴自动结算。</p></section>`;
    }
  });

  /* ===== 考勤采集 ===== */
  window.HR_SPEC_ADD({
    key: 'attendance-collect', title: '考勤采集',
    desc: '门禁、指纹、人脸识别、APP 定位打卡数据自动汇总；迟到早退、漏打卡的申诉与补卡审批，异常数据按部门闭环处理。',
    metrics: [
      { label: '本月打卡记录', value: '58,420', unit: '条', note: '门禁 32% · 人脸 46% · APP 22%', color: '#7659e7' },
      { label: '出勤率', value: '98.6', unit: '%', note: '较上月 +0.4%', cls: 'up', color: '#1cad9b' },
      { label: '异常记录', value: '36', unit: '条', note: '迟到 12 · 早退 8 · 漏卡 16', cls: 'warn', color: '#e5a22a' },
      { label: '待处理申诉', value: '4', unit: '条', note: '超时未处理 1 条', cls: 'danger', color: '#eb6262' }
    ],
    tabs: [
      {
        key: 'month', label: '打卡采集', title: '2026 年 10 月考勤汇总（自动采集）',
        columns: [
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)} · ${H.esc(r.dept)}</div></div>`, width: '200px' },
          { label: '应出勤', key: 'workDays', width: '80px', align: 'right' },
          { label: '实际出勤', key: 'actual', width: '90px', align: 'right' },
          { label: '加班时长', render: (r) => `${r.overtime} 小时`, width: '90px', align: 'right' },
          { label: '迟到', key: 'late', width: '70px', align: 'center' },
          { label: '早退', key: 'early', width: '70px', align: 'center' },
          { label: '漏打卡', key: 'missing', width: '80px', align: 'center' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '110px' }
        ],
        rows: D2.ATTENDANCE, searchKeys: ['name', 'empNo', 'unit', 'dept'],
        filter: { key: 'status', options: ['正常', '异常待处理'], label: '全部状态' }, readonly: true
      },
      {
        key: 'exception', label: '异常处理', title: '考勤异常申诉与补卡审批',
        columns: [
          { label: '单号', key: 'id', width: '130px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '日期', key: 'date', width: '110px' },
          { label: '异常类型', key: 'type', render: (r) => H.chip(r.type, 'orange'), width: '90px' },
          { label: '异常说明', render: (r) => `<span class="sub">${H.esc(r.detail)}</span>`, width: '250px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '120px' },
          { label: '处理人', key: 'owner', width: '90px' }
        ],
        rows: D2.ATT_EXCEPTIONS, searchKeys: ['name', 'id', 'type'],
        filter: { key: 'type', options: ['迟到', '早退', '漏打卡'], label: '全部异常' }
      }
    ],
    extra: () => H.panel('多方式打卡采集', `<div class="mini-stats">
      <div class="mini-stat"><b>门禁</b><span>刷卡 18,624 条 · 覆盖率 100%</span></div>
      <div class="mini-stat"><b>人脸识别</b><span>26,873 条 · 主要采集方式</span></div>
      <div class="mini-stat"><b>APP 定位</b><span>12,923 条 · 外勤 / 巡检</span></div>
      <div class="mini-stat"><b>指纹</b><span>备用通道 · 门禁异常时启用</span></div></div>`, '自动汇总 · 每日 06:00')
  });

  /* ===== 假勤管理 ===== */
  window.HR_SPEC_ADD({
    key: 'attendance-leave', title: '假勤管理',
    desc: '年休假、探亲假、婚丧假、产假、陪产假、病假、工伤假、调休统一管理；按工龄自动生成年休假额度，余额实时查询。',
    metrics: [
      { label: '本月请假', value: '68', unit: '人次', note: '年休假 42 · 病假 12', color: '#7659e7' },
      { label: '年休假余额', value: '8,462', unit: '天', note: '人均 3.2 天', color: '#4389ed' },
      { label: '产假 / 陪产', value: '12', unit: '人', note: '在休 4 人', color: '#1cad9b' },
      { label: '假期额度预警', value: '36', unit: '人', note: '年度内未休完', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'type', label: '假期类型', title: '假期类型与审批记录',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '假期类型', key: 'type', render: (r) => H.chip(r.type, 'blue'), width: '100px' },
          { label: '开始日期', key: 'start', width: '110px' },
          { label: '天数', key: 'days', width: '70px', align: 'right' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '审批人', key: 'owner', width: '90px' }
        ],
        rows: D2.LEAVE_RECORDS, searchKeys: ['name', 'id', 'type'],
        filter: { key: 'type', options: ['年休假', '探亲假', '婚假', '产假', '病假', '工伤假', '陪产假', '调休'], label: '全部假期' }
      },
      {
        key: 'balance', label: '假期额度', title: '年休假额度（按工龄自动生成）',
        columns: [
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)}</div></div>`, width: '150px' },
          { label: '单位', key: 'unit', width: '100px' },
          { label: '年休假额度', render: (r) => `${r.annual} 天`, width: '100px', align: 'right' },
          { label: '已休', render: (r) => `${r.used} 天`, width: '80px', align: 'right' },
          { label: '剩余', render: (r) => `<span class="strong">${r.remain} 天</span>`, width: '80px', align: 'right' },
          { label: '病假', render: (r) => `${r.sick} 天`, width: '80px', align: 'right' },
          { label: '调休余额', render: (r) => `${r.comp} 天`, width: '90px', align: 'right' }
        ],
        rows: D2.LEAVE_BALANCE, searchKeys: ['name', 'empNo', 'unit'], readonly: true
      }
    ],
    extra: () => H.panel('假期规则', `<div class="formula">年休假按工龄自动生成：1–10 年 5 天 / 10–20 年 10 天 / 20 年以上 15 天；探亲假 20 天（异地已婚）；婚假 10 天；产假 158 天；陪产假 15 天；病假凭医院证明按工龄计发工资；工伤假按《工伤保险条例》执行。</div>`, '自动生成 · 余额实时查询')
  });

  /* ===== 加班管理 ===== */
  window.HR_SPEC_ADD({
    key: 'attendance-overtime', title: '加班管理',
    desc: '加班事前申请、审批、加班时长统计与加班费 / 调休折算，关联薪酬核算与考勤排班。',
    metrics: [
      { label: '本月加班', value: '186', unit: '人次', note: '累计 1,248 小时', color: '#7659e7' },
      { label: '加班费', value: '3.8', unit: '万元', note: '按月随工资发放', color: '#4389ed' },
      { label: '调休折算', value: '62', unit: '人次', note: '折合 186 小时', color: '#1cad9b' },
      { label: '待审批', value: '3', unit: '件', note: '超时未审批 1 件', cls: 'warn', color: '#e5a22a' }
    ],
    columns: [
      { label: '单号', key: 'id', width: '120px' },
      { label: '员工', key: 'name', bold: true, width: '90px' },
      { label: '日期', key: 'date', width: '110px' },
      { label: '加班类型', key: 'type', render: (r) => H.chip(r.type, 'purple'), width: '130px' },
      { label: '时长', render: (r) => `${r.hours} 小时`, width: '80px', align: 'right' },
      { label: '事由', render: (r) => `<span class="sub">${H.esc(r.reason)}</span>`, width: '200px' },
      { label: '折算方式', key: 'pay', width: '90px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
    ],
    rows: D2.OVERTIME, searchKeys: ['name', 'id', 'reason'],
    filter: { key: 'type', options: ['延时加班', '休息日加班', '法定节假日加班'], label: '全部类型' },
    meta: { entity: '加班申请', labels: { id: '单号', name: '员工', date: '日期', type: '加班类型', hours: '时长', reason: '事由', pay: '折算方式', status: '状态' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'date', label: '加班日期', type: 'date' },
      { key: 'type', label: '加班类型', type: 'select', options: ['延时加班', '休息日加班', '法定节假日加班'] },
      { key: 'hours', label: '加班时长（小时）' }, { key: 'reason', label: '事由', full: true }, { key: 'pay', label: '折算方式', type: 'select', options: ['加班费', '调休'] }
    ] },
    extra: () => H.panel('加班折算标准', `<div class="formula">工作日延时加班：时薪 × 150%；休息日加班：时薪 × 200%；法定节假日加班：时薪 × 300%。<br>时薪 = 基本薪酬 ÷ 21.75 ÷ 8；加班费随当月工资发放，选择调休的计入调休余额，6 个月内有效。</div>`, '集团统一标准')
      + H.panel('加班换休闭环（加班累计 → 换休额度 → 审批扣减）', `<div class="flow-row">${[['加班申请'], ['审批通过'], ['累计换休额度'], ['换休申请'], ['审批扣减']].map((x, i, a) => `<div class="flow-node ${i === 2 ? 'active' : ''}"><div class="flow-num">${i + 1}</div><div class="flow-body"><div class="flow-title">${x[0]}</div></div></div>${i < a.length - 1 ? '<div class="flow-arrow"></div>' : ''}`).join('')}</div>
        ${tbl([
          { label: '员工', key: 'name', bold: true },
          { label: '累计加班', key: 'total', align: 'right' },
          { label: '已换休', key: 'used', align: 'right' },
          { label: '剩余额度', render: (r) => `<span class="strong">${r.left} 小时</span>`, align: 'right' },
          { label: '有效期', key: 'valid' },
          { label: '状态', render: (r) => H.statusTag(r.status) }
        ], [
          { name: '张伟', total: '36 小时', used: '16 小时', left: 20, valid: '2027-04-28', status: '正常' },
          { name: '陈立', total: '48 小时', used: '24 小时', left: 24, valid: '2027-04-27', status: '正常' },
          { name: '周鹏', total: '28 小时', used: '8 小时', left: 20, valid: '2027-04-26', status: '正常' },
          { name: '吴磊', total: '32 小时', used: '32 小时', left: 0, valid: '2027-04-25', status: '已用完' },
          { name: '刘婷', total: '12 小时', used: '4 小时', left: 8, valid: '2027-04-24', status: '正常' },
          { name: '徐涛', total: '20 小时', used: '12 小时', left: 8, valid: '2027-04-20', status: '正常' }
        ])}<p class="panel-note">加班累计自动折算换休额度，换休审批通过后自动扣减，形成加班—换休闭环；额度 6 个月内有效，逾期作废并提示。</p>`, '自动折算 · 审批扣减')
});

  /* ===== 薪酬体系 ===== */
  window.HR_SPEC_ADD({
    key: 'salary-system', title: '薪酬体系',
    desc: '岗位工资、技能工资、绩效工资、工龄工资、津贴补贴构成配置；高温、夜班、有毒有害、艰苦岗位、交通通讯等津补贴统一标准。',
    metrics: [
      { label: '标准版本', value: 'V2026.1', note: '2026-01-01 生效', color: '#7659e7' },
      { label: '覆盖单位', value: '7', unit: '家', note: '全集团统一复用', color: '#4389ed' },
      { label: '薪酬项目', value: '12', unit: '项', note: '基本 / 加班 / 津贴 / 绩效', color: '#1cad9b' },
      { label: '浮动区间', value: '±10', unit: '%', note: '超出须报集团审批', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const bands = ['1–5 年', '6–10 年', '11–20 年', '21–30 年', '30 年以上'];
      const matrix = `<table class="hr-table matrix"><thead><tr><th>职称 / 技能等级</th>${bands.map((b) => `<th class="col-hd" style="text-align:right">${b}</th>`).join('')}</tr></thead><tbody>
        ${D2.SAL_STANDARDS.map((r) => `<tr><td class="strong">${r.level}</td>${r.v.map((v) => `<td class="num">${v.toLocaleString()}</td>`).join('')}</tr>`).join('')}
      </tbody></table>`;
      const struct = `<div class="chip-wall">${D2.SAL_STRUCTURE.map((s) => `<span class="chip purple" title="${s.note}">${s.name}：${s.formula}</span>`).join('')}</div>
        <div class="formula" style="margin-top:14px">应发工资 = 基本薪酬 ＋ 加班工资 ＋ 特殊班次津贴 ＋ 绩效工资 ＋ 其他津补贴 － 考勤扣款<br>实发工资 = 应发工资 － 五险一金个人部分 － 个人所得税（累计预扣法）</div>`;
      const allow = `<div class="mini-stats">
        ${[['夜班', '60 元 / 班'], ['中班', '40 元 / 班'], ['倒班津贴', '25 元 / 班'], ['节假日值班', '200 元 / 班']].map((x) => `<div class="mini-stat"><b>${x[1]}</b><span>${x[0]}</span></div>`).join('')}
      </div><div class="note-line">高温 / 有毒有害岗位津贴 300–600 元 / 月；交通通讯补贴按职级 100–400 元 / 月；班次由考勤排班自动带入，节假日按国家法定日历判定。</div>`;
      return H.mcards([
        { label: '标准版本', value: 'V2026.1', note: '2026-01-01 生效', color: '#7659e7' },
        { label: '覆盖单位', value: '7', unit: '家', note: '全集团统一复用', color: '#4389ed' },
        { label: '薪酬项目', value: '12', unit: '项', note: '基本 / 加班 / 津贴 / 绩效', color: '#1cad9b' },
        { label: '浮动区间', value: '±10', unit: '%', note: '超出须报集团审批', cls: 'warn', color: '#e5a22a' }
      ]) + H.panel('基本薪酬标准（职称 / 技能等级 × 工龄档）', matrix, '单位：元 / 月 · V2026.1')
      + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>薪酬结构构成（统一公式）</h3><span class="panel-extra">一处维护 · 全集团复用</span></div>${struct}</section>
        <section class="panel-card"><div class="panel-header"><h3>特殊班次与岗位津贴标准</h3><span class="panel-extra">集团统一</span></div>${allow}</section></div>`
      + H.panel('子公司薪酬规则配置', tbl([
        { label: '单位', key: 'unit', bold: true },
        { label: '薪酬规则套数', key: 'rules', align: 'right' },
        { label: '覆盖人员', key: 'people', align: 'right' },
        { label: '差异化内容', render: (r) => `<span class="sub">${H.esc(r.scope)}</span>` },
        { label: '配置状态', render: (r) => H.statusTag(r.status) }
      ], [
        { unit: '集团本部', rules: 1, people: '386 人', scope: '集团统一标准', status: '已配置' },
        { unit: '三叶实业', rules: 2, people: '726 人', scope: '常白班 + 倒班津贴 · 37 个成本中心', status: '已配置' },
        { unit: '汇丰石化', rules: 2, people: '618 人', scope: '特殊岗位津贴 + 夜班补贴', status: '已配置' },
        { unit: '翔鑫工贸', rules: 2, people: '452 人', scope: '管输岗位 + 外勤补贴', status: '已配置' },
        { unit: '维达石化', rules: 7, people: '268 人', scope: '7 套工资规则（维达反馈）', status: '已配置' },
        { unit: '宏达人力', rules: 1, people: '246 人', scope: '派遣人员统一规则', status: '已配置' },
        { unit: '兰达工贸', rules: 1, people: '150 人', scope: '工程承包人员规则', status: '已配置' }
      ]), '公式配置一次、长期沿用 · 共 16 套规则')
      + H.panel('进档管理', tbl([
        { label: '员工', key: 'name', bold: true },
        { label: '单位', key: 'unit' },
        { label: '进档类型', render: (r) => H.chip(r.type, 'blue') },
        { label: '进档周期', key: 'cycle' },
        { label: '下次进档', key: 'next' },
        { label: '加薪标准', key: 'add' },
        { label: '状态', render: (r) => H.statusTag(r.status) }
      ], [
        { name: '张伟', unit: '集团本部', type: '年度进档', cycle: '12 个月', next: '2027-01-01', add: '1 档 / 300 元', status: '待提醒' },
        { name: '王强', unit: '汇丰石化', type: '职称进档', cycle: '24 个月', next: '2026-12-01', add: '2 档 / 600 元', status: '待审批' },
        { name: '李静', unit: '集团本部', type: '年度进档', cycle: '12 个月', next: '2027-04-10', add: '1 档 / 300 元', status: '待提醒' },
        { name: '陈立', unit: '三叶实业', type: '技能进档', cycle: '36 个月', next: '2026-11-01', add: '1 档 / 400 元', status: '待审批' },
        { name: '赵敏', unit: '集团本部', type: '年度进档', cycle: '12 个月', next: '2027-07-15', add: '1 档 / 300 元', status: '待提醒' },
        { name: '周鹏', unit: '维达石化', type: '技能进档', cycle: '24 个月', next: '2026-12-25', add: '2 档 / 500 元', status: '已进档' }
      ]), '到期自动提醒人事岗 · 需审批后生效');
    }
  });

  /* ===== 薪资核算 ===== */
  window.HR_SPEC_ADD({
    key: 'salary-calc', title: '薪资核算',
    desc: '自动关联考勤、绩效、社保数据生成月度工资表；个税专项附加扣除、五险一金代扣计算；电子工资条推送、员工查询与确认。',
    metrics: [
      { label: '本月核算人数', value: '2,846', unit: '人', note: '已核算 2,712 人', color: '#7659e7' },
      { label: '应发合计', value: '862.4', unit: '万元', note: '较上月 +2.3%', color: '#4389ed' },
      { label: '实发合计', value: '684.2', unit: '万元', note: '代扣 178.2 万元', color: '#1cad9b' },
      { label: '工资条确认', value: '2,486', unit: '人', note: '确认率 87.3%', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const flow = `<div class="flow-row">${D2.SAL_STEPS.map((s, i) => `<div class="flow-node ${s.state}"><div class="flow-num">${s.state === 'done' ? '✓' : s.num}</div>
        <div class="flow-body"><div class="flow-title">${s.title}</div><div class="flow-desc">${s.desc.replace(/\n/g, '<br>')}</div></div></div>${i < D2.SAL_STEPS.length - 1 ? '<div class="flow-arrow"></div>' : ''}`).join('')}</div>`;
      const records = tbl([
        { label: '流程节点', key: 'step' }, { label: '处理人 / 岗位', key: 'user' }, { label: '处理时间', key: 'time' },
        { label: '结果', render: (r) => H.chip(r.result, r.tag) }
      ], D2.SAL_RECORDS);
      const payroll = tbl([
        { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)} · ${H.esc(r.dept)}</div></div>` },
        { label: '基本薪酬', render: (r) => r.basic.toLocaleString(), align: 'right' },
        { label: '加班', render: (r) => r.overtime.toLocaleString(), align: 'right' },
        { label: '班次津贴', render: (r) => r.shift.toLocaleString(), align: 'right' },
        { label: '绩效工资', render: (r) => r.perf.toLocaleString(), align: 'right' },
        { label: '应发', render: (r) => `<span class="strong">${r.gross.toLocaleString()}</span>`, align: 'right' },
        { label: '代扣', render: (r) => `<span class="sub">-${r.deduct.toLocaleString()}</span>`, align: 'right' },
        { label: '实发', render: (r) => `<span class="strong" style="color:#5e46c6">${r.net.toLocaleString()}</span>`, align: 'right' },
        { label: '状态', render: (r) => H.statusTag(r.status) }
      ], window.HR_SCOPE ? D2.PAYROLL.filter((r) => window.HR_SCOPE.inScope(r)) : D2.PAYROLL);
      return H.mcards([
        { label: '本月核算人数', value: '2,846', unit: '人', note: '已核算 2,712 人', color: '#7659e7' },
        { label: '应发合计', value: '862.4', unit: '万元', note: '较上月 +2.3%', color: '#4389ed' },
        { label: '实发合计', value: '684.2', unit: '万元', note: '代扣 178.2 万元', color: '#1cad9b' },
        { label: '工资条确认', value: '2,486', unit: '人', note: '确认率 87.3%', cls: 'warn', color: '#e5a22a' }
      ]) + H.panel('薪酬审批工作流（逐级上报 · 不可越级）', flow, '2026 年 10 月 · 第 4 步 / 共 6 步')
      + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>本月审批记录（留痕）</h3><span class="panel-extra">共 6 个节点</span></div>${records}</section>
        <section class="panel-card"><div class="panel-header"><h3>会签文件（自动生成）</h3><span class="panel-extra">预览</span></div>
          <div class="detail-hero"><strong>中陆人薪〔2026〕10-018 号</strong><span>2026 年 10 月薪酬发放审批表 · 应发合计 ¥8,624,300.00</span></div>
          <div class="chip-wall"><span class="chip green">集团人资 已签</span><span class="chip green">集团财务 已签</span><span class="chip purple">分管领导 已签</span></div>
          <p class="note-line">附件：薪酬明细表（1,842 行）、考勤汇总表、绩效结果表。电子签章已固化，文件锁定不可修改，可下载留档。</p></section></div>`
      + H.panel('月度工资表（自动关联考勤 / 绩效 / 社保）', payroll, '共 14 条演示数据 · 全员 2,846 人')
      + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>个税与代扣</h3><span class="panel-extra">累计预扣法</span></div>
          <div class="mini-stats" style="grid-template-columns:1fr 1fr">
            <div class="mini-stat"><b>862 人</b><span>专项附加扣除申报</span></div>
            <div class="mini-stat"><b>427.16 万</b><span>五险一金个人部分</span></div>
            <div class="mini-stat"><b>96.4 万</b><span>本月代扣个税</span></div>
            <div class="mini-stat"><b>12.8 万</b><span>其他扣款（补缴 / 借款）</span></div>
          </div>
          <p class="panel-note">个税按累计预扣法计算，专项附加扣除（子女教育、住房贷款、赡养老人等）由员工自助申报；后续对接“薪福通”接口自动同步扣除数据，并与个税报税系统衔接，减少人工核对。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>工资条发放</h3><span class="panel-extra">电子工资条 · 员工确认</span></div>
          <div class="bar-list">
            <div class="bar-item"><span class="b-label">已推送</span><div class="bar-track"><span class="bar-fill" style="width:100%"></span></div><b>2,846</b></div>
            <div class="bar-item"><span class="b-label">已查询</span><div class="bar-track"><span class="bar-fill blue" style="width:92%"></span></div><b>2,610</b></div>
            <div class="bar-item"><span class="b-label">已确认</span><div class="bar-track"><span class="bar-fill green" style="width:87%"></span></div><b>2,486</b></div>
            <div class="bar-item"><span class="b-label">异议待处理</span><div class="bar-track"><span class="bar-fill orange" style="width:4%"></span></div><b>36</b></div>
          </div>
          <p class="panel-note">工资条通过 APP / 钉钉推送，员工可查询明细并在线确认；异议自动转薪酬专员复核，确认结果留痕。</p></section></div>`
      + H.panel('工资总额预算与月度审批', `<div class="mini-stats">
          <div class="mini-stat"><b>1.24 亿元</b><span>年初核定年度工资总额（员工部分）</span></div>
          <div class="mini-stat"><b>85%</b><span>按比例分摊至各月基础额度</span></div>
          <div class="mini-stat"><b>21 日 / 25 日</b><span>其他公司 21 日 · 三叶 25 日</span></div>
          <div class="mini-stat"><b>4 类</b><span>新增 / 调资 / 季度奖专项通道</span></div>
        </div>
        <div class="chip-wall" style="margin-top:12px"><span class="chip blue">新增人员专项通道</span><span class="chip blue">调资专项通道</span><span class="chip blue">季度奖专项通道</span><span class="chip orange">额度变化自动比对</span><span class="chip orange">审批超时自动催办 / 升级提醒</span><span class="chip green">审批全程留痕</span></div>
        <p class="panel-note">按 85% 比例分摊至各月作为当月基础薪酬额度；合理超支走专项通道，减少反复审批；子公司上报额度有变化时可比对审批。</p>`, '审批日历统一')
      + H.panel('特殊场景核算', tbl([
        { label: '场景', key: 'scene', bold: true, width: '180px' },
        { label: '处理方式', render: (r) => `<span class="sub">${H.esc(r.how)}</span>` },
        { label: '状态', render: (r) => H.statusTag(r.status) }
      ], [
        { scene: '内退工资', how: '按内退协议标准单独核算，不计入在岗薪酬总额', status: '已支持' },
        { scene: '退休当月补发', how: '退休手续跨月时补发当月工资，单独生成补发单', status: '已支持' },
        { scene: '定薪特殊人员', how: '按协议定薪，支持手动调整单人薪资并附审批说明', status: '已支持' },
        { scene: '请假工资（21.75）', how: '按法定工作日 21.75 规则核算，允许工资倒扣甚至为负', status: '已支持' },
        { scene: '跨年度追溯', how: '特定薪酬项可计入对应年度成本，次年发放也准确归属', status: '已支持' },
        { scene: '离职 / 退休补发一个月', how: '保留人员历史薪资，支持离职后一次性补发并留痕', status: '已支持' }
      ]), '按会议纪要补充场景 · 全部留痕')
      + H.panel('年终奖计税方案对比', `<div class="two-columns"><div>
          <div class="mini-stats" style="grid-template-columns:1fr 1fr">
            <div class="mini-stat"><b>单独计税</b><span>年终奖单独按 3%–45% 税率计算</span></div>
            <div class="mini-stat"><b>综合计税</b><span>并入综合所得按累计预扣法</span></div>
          </div>
          <p class="panel-note">系统按员工全年收入自动测算两种方案，择优推荐并留痕。</p>
        </div><div><div class="formula">示例：年终奖 32,400 元<br>单独计税：应纳税额 ≈ 2,916 元<br>综合计税：应纳税额 ≈ 3,840 元<br><b>系统推荐：单独计税</b>（节税 924 元）</div></div></div>`, '自动测算最优');
    }
  });

  /* ===== 薪酬调整 ===== */
  window.HR_SPEC_ADD({
    key: 'salary-adjust', title: '薪酬调整',
    desc: '年度调薪、晋升调薪、岗位变动调薪的申请与审批；年终奖、效益奖、专项奖、安全奖的分配与发放。',
    metrics: [
      { label: '年度调薪', value: '2,846', unit: '人', note: '平均增幅 5.2%', color: '#7659e7' },
      { label: '晋升调薪', value: '12', unit: '人', note: '平均上调 1 档', color: '#4389ed' },
      { label: '奖金总额', value: '486', unit: '万元', note: '年终奖 / 效益奖 / 专项奖', color: '#1cad9b' },
      { label: '待审批', value: '3', unit: '项', note: '11 月生效', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'adjust', label: '调薪管理', title: '调薪申请与审批',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '调薪类型', key: 'type', render: (r) => H.chip(r.type, 'purple'), width: '130px' },
          { label: '调整前', render: (r) => `<span class="num">${r.before}</span>`, width: '100px', align: 'right' },
          { label: '调整后', render: (r) => `<span class="num strong">${r.after}</span>`, width: '100px', align: 'right' },
          { label: '生效日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.SAL_ADJUST, searchKeys: ['name', 'id', 'type'],
        filter: { key: 'type', options: ['年度调薪', '晋升调薪', '岗位变动调薪', '技能等级调薪', '转正调薪'], label: '全部类型' }
      },
      {
        key: 'bonus', label: '奖金管理', title: '奖金分配与发放',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '奖金类型', key: 'type', render: (r) => H.chip(r.type, 'blue'), width: '110px' },
          { label: '金额', render: (r) => `<span class="num">${r.amount} 元</span>`, width: '110px', align: 'right' },
          { label: '所属期间', key: 'period', width: '120px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.BONUS, searchKeys: ['name', 'type'], readonly: true
      },
      {
        key: 'step', label: '进档管理', title: '进档管理（自定义周期 · 到期提醒 · 审批后自动核算）',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '单位', key: 'unit', width: '110px' },
          { label: '进档类型', render: (r) => H.chip(r.type, 'blue'), width: '100px' },
          { label: '进档周期', key: 'cycle', width: '100px' },
          { label: '下次进档', key: 'next', width: '110px' },
          { label: '加薪标准', key: 'add', width: '130px' },
          { label: '审批状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: [
          { name: '张伟', unit: '集团本部', type: '年度进档', cycle: '12 个月', next: '2027-01-01', add: '1 档 / 300 元', status: '待提醒' },
          { name: '王强', unit: '汇丰石化', type: '职称进档', cycle: '24 个月', next: '2026-12-01', add: '2 档 / 600 元', status: '待审批' },
          { name: '李静', unit: '集团本部', type: '年度进档', cycle: '12 个月', next: '2027-04-10', add: '1 档 / 300 元', status: '待提醒' },
          { name: '陈立', unit: '三叶实业', type: '技能进档', cycle: '36 个月', next: '2026-11-01', add: '1 档 / 400 元', status: '待审批' },
          { name: '赵敏', unit: '集团本部', type: '年度进档', cycle: '12 个月', next: '2027-07-15', add: '1 档 / 300 元', status: '待提醒' },
          { name: '周鹏', unit: '维达石化', type: '技能进档', cycle: '24 个月', next: '2026-12-25', add: '2 档 / 500 元', status: '已进档' }
        ],
        searchKeys: ['name', 'unit', 'type'], readonly: true
      }
    ],
    meta: { entity: '调薪单', labels: { id: '单号', name: '员工', type: '调薪类型', before: '调整前', after: '调整后', date: '生效日期', status: '状态' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '调薪类型', type: 'select', options: ['年度调薪', '晋升调薪', '岗位变动调薪', '技能等级调薪', '转正调薪'] },
      { key: 'before', label: '调整前（元）' }, { key: 'after', label: '调整后（元）' }, { key: 'date', label: '生效日期', type: 'date' }
    ] }
  });

  /* ===== 薪酬分析 ===== */
  window.HR_SPEC_ADD({
    key: 'salary-analysis', title: '薪酬分析',
    desc: '薪酬带宽、人工成本总额、人均效能分析与保密管控；按单位 / 序列 / 职级多维分析，支持领导驾驶舱与导出。',
    metrics: [
      { label: '年度人工成本', value: '1.84', unit: '亿元', note: '较上年 +6.4%', color: '#7659e7' },
      { label: '人均人工成本', value: '6.47', unit: '万元', note: '同比 +4.2%', color: '#4389ed' },
      { label: '人工成本率', value: '12.8', unit: '%', note: '同比下降 0.6pt', cls: 'up', color: '#1cad9b' },
      { label: '薪酬带宽使用率', value: '86', unit: '%', note: '高位区间 12%', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const bars = D2.COST_STRUCT.map((c) => `<div class="bar-item"><span class="b-label">${c.name}</span>
        <div class="bar-track"><span class="bar-fill" style="width:${c.pct}%;background:linear-gradient(90deg,${c.color},${c.color}bb)"></span></div>
        <b>${c.pct}%</b></div>`).join('');
      const units = D2.REPORT_UNITS.map((u) => `<div class="bar-item"><span class="b-label">${u.unit}</span>
        <div class="bar-track"><span class="bar-fill blue" style="width:${u.pct * 3.4}%"></span></div>
        <b>${u.people} 人</b></div>`).join('');
      const donut = `<div class="donut-wrap"><div class="donut" style="background:conic-gradient(#7055df 0 58%, #4389ed 58% 76%, #14a58b 76% 88%, #e5a22a 88% 95%, #eb6262 95% 100%)">
        <div class="donut-center"><b>1.84 亿</b><span>年度人工成本</span></div></div>
        <div class="legend">${D2.COST_STRUCT.map((c) => `<span><i style="background:${c.color}"></i>${c.name} ${c.amount}</span>`).join('')}</div></div>`;
      return H.mcards([
        { label: '年度人工成本', value: '1.84', unit: '亿元', note: '较上年 +6.4%', color: '#7659e7' },
        { label: '人均人工成本', value: '6.47', unit: '万元', note: '同比 +4.2%', color: '#4389ed' },
        { label: '人工成本率', value: '12.8', unit: '%', note: '同比下降 0.6pt', cls: 'up', color: '#1cad9b' },
        { label: '薪酬带宽使用率', value: '86', unit: '%', note: '高位区间 12%', cls: 'warn', color: '#e5a22a' }
      ]) + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>人工成本构成（2026 年度）</h3><span class="panel-extra">总额 1.84 亿元</span></div>${donut}
        <div class="bar-list" style="margin-top:18px">${bars}</div></section>
        <section class="panel-card"><div class="panel-header"><h3>各单位在册人数</h3><span class="panel-extra">7 家单位 · 2,846 人</span></div>${units}
        <p class="panel-note">可一键切换：人员结构、编制执行率、年龄学历、工龄分布、流失率等 18 张常规报表。</p></section></div>`
      + H.panel('薪酬保密管控', `<div class="dot-list">
          <div class="dot-item"><i></i>薪酬数据按角色分级授权：集团薪酬经理可见全量，子公司仅可见本单位，部门负责人仅可见本部门汇总。</div>
          <div class="dot-item"><i></i>导出、截图、打印均记录审计日志；敏感字段默认脱敏，需二次审批方可查看。</div>
          <div class="dot-item"><i></i>薪酬分析结果仅用于管理决策，不得对外披露个人薪酬明细。</div>
        </div>`, '数据分级授权');
    }
  });

  /* ===== 福利 · 参保管理 ===== */
  window.HR_SPEC_ADD({
    key: 'benefit-insurance', title: '参保管理',
    desc: '五险一金统一参保登记、人员增减、参保地变更申报；年度缴费基数申报、比例调整与历史记录留档。',
    metrics: [
      { label: '参保人数', value: '2,846', unit: '人', note: '五险参保率 100%', cls: 'up', color: '#7659e7' },
      { label: '公积金建户', value: '2,792', unit: '人', note: '54 名劳务派遣不缴', color: '#4389ed' },
      { label: '本月增减员', value: '20', unit: '人', note: '新增 12 · 减少 8', color: '#1cad9b' },
      { label: '待申报', value: '3', unit: '笔', note: '社保网上申报待提交', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const cards = `<div class="overview-grid" style="grid-template-columns:repeat(3,1fr)">${D2.INS_TYPES.map((i) => `<div class="unit-card" style="cursor:default">
        <div class="u-name" style="display:flex;justify-content:space-between"><span>${i.name}</span><i style="width:8px;height:8px;border-radius:50%;background:${i.color};display:inline-block"></i></div>
        <div class="u-full">${i.people}</div><div class="u-desc">单位 ${i.unit} · 个人 ${i.person}</div>
        <div class="u-foot"><span>缴费基数</span><b>¥${i.base}</b></div></div>`).join('')}</div>`;
      const changes = tbl([
        { label: '单号', key: 'id' }, { label: '员工', key: 'name' }, { label: '业务类型', render: (r) => H.chip(r.type, r.type === '新增参保' ? 'green' : 'orange') },
        { label: '单位', key: 'unit' }, { label: '申报日期', key: 'date' }, { label: '状态', render: (r) => H.statusTag(r.status) }
      ], D2.INS_CHANGES);
      const bases = tbl([
        { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)}</div></div>` },
        { label: '单位', key: 'unit' }, { label: '原基数', render: (r) => r.old.toLocaleString(), align: 'right' },
        { label: '新基数', render: (r) => `<span class="strong">${r.base.toLocaleString()}</span>`, align: 'right' },
        { label: '差额', render: (r) => `+${r.diff}`, align: 'right' }, { label: '状态', render: (r) => H.statusTag(r.status) }
      ], D2.INS_BASE);
      return H.mcards([
        { label: '参保人数', value: '2,846', unit: '人', note: '五险参保率 100%', cls: 'up', color: '#7659e7' },
        { label: '公积金建户', value: '2,792', unit: '人', note: '54 名劳务派遣不缴', color: '#4389ed' },
        { label: '本月增减员', value: '20', unit: '人', note: '新增 12 · 减少 8', color: '#1cad9b' },
        { label: '待申报', value: '3', unit: '笔', note: '社保网上申报待提交', cls: 'warn', color: '#e5a22a' }
      ]) + H.panel('六险一金参保概况', cards, '2026 年 10 月 · 已申报')
      + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>参保增减员</h3><span class="panel-extra">新增 12 · 减少 8</span></div>${changes}<p class="panel-note">新入职统一办理参保，离职 / 退休当月办理减员；参保地变更同步社保关系转移。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>年度缴费基数申报（2026 年度）</h3><span class="panel-extra">完成率 100%</span></div>${bases}<p class="panel-note">基数区间 4,080–20,400 元（社平 60%–300%）；低于下限上调 12 人，高于上限封顶 8 人。</p></section></div>`
      + H.panel('社保缴费基数自动核定规则', `<div class="dot-list">
          <div class="dot-item"><i></i>基数按上年度全年应发工资自动核算，不足一年按实际月份折算。</div>
          <div class="dot-item"><i></i>疗养费、劳保用品、一次性奖励等不计入基数的项目自动剔除，避免基数虚高。</div>
          <div class="dot-item"><i></i>基数调整后自动生成补收、退收单据；异常薪资（负数 / 补发）支持扣回并留痕。</div>
          <div class="dot-item"><i></i>基数区间 4,080–20,400 元，低于下限上调、高于上限封顶，调整记录可追溯。</div>
        </div>`, '按上年度应发工资自动核算');
    }
  });

  /* ===== 缴费核算 ===== */
  window.HR_SPEC_ADD({
    key: 'benefit-payment', title: '缴费核算',
    desc: '养老、医疗、失业、工伤、生育及住房公积金的缴费测算；补充医疗保险、雇主责任险的参保与理赔。',
    metrics: [
      { label: '本月缴费', value: '1,158.16', unit: '万元', note: '单位 + 个人合计', color: '#7659e7' },
      { label: '单位承担', value: '731.00', unit: '万元', note: '占比 63.1%', color: '#4389ed' },
      { label: '个人承担', value: '427.16', unit: '万元', note: '占比 36.9%', color: '#1cad9b' },
      { label: '人均月缴费', value: '4,069', unit: '元/人', note: '按人均基数 6,800 元', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'calc', label: '费用计算', title: '各单位五险一金缴费测算（2026 年 10 月）',
        columns: [
          { label: '单位', key: 'unit', bold: true, width: '110px' },
          { label: '人数', key: 'people', width: '80px', align: 'right' },
          { label: '缴费基数合计', key: 'base', width: '130px', align: 'right' },
          { label: '单位部分', key: 'unitPart', width: '110px', align: 'right' },
          { label: '个人部分', key: 'personPart', width: '110px', align: 'right' },
          { label: '合计', render: (r) => `<span class="strong">${r.total}</span>`, width: '110px', align: 'right' }
        ],
        rows: D2.PAY_UNITS, searchKeys: ['unit'], readonly: true
      },
      {
        key: 'extra', label: '补充保险', title: '补充医疗保险 / 雇主责任险',
        columns: [
          { label: '险种', key: 'name', bold: true, width: '180px' },
          { label: '参保人数', key: 'people', width: '110px', align: 'right' },
          { label: '保费标准', key: 'rate', width: '150px' },
          { label: '承保机构', key: 'org', width: '180px' },
          { label: '到期日期', key: 'end', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: [
          { name: '补充医疗保险', people: '2,846 人', rate: '480 元/人·年', org: '中国人寿甘肃省分公司', end: '2027-06-30', status: '生效中' },
          { name: '雇主责任险', people: '2,846 人', rate: '320 元/人·年', org: '中国平安财险', end: '2027-03-31', status: '生效中' },
          { name: '意外伤害险', people: '1,268 人', rate: '180 元/人·年', org: '太平洋保险', end: '2026-12-31', status: '即将到期' },
          { name: '重大疾病互助', people: '2,412 人', rate: '60 元/人·年', org: '集团工会', end: '2027-01-01', status: '生效中' }
        ],
        searchKeys: ['name', 'org'], readonly: true
      }
    ],
    extra: () => H.panel('缴费比例', `<div class="chip-wall">${D2.INS_TYPES.map((i) => `<span class="chip blue">${i.name} 单位 ${i.unit} / 个人 ${i.person}</span>`).join('')}</div>
      <p class="panel-note">按 6,800 元人均基数测算，本月合计缴费 1,158.16 万元；公积金 2,792 人建户，54 名劳务派遣人员按政策不缴。</p>`, '2026 年 10 月')
  });

  /* ===== 待遇办理 ===== */
  window.HR_SPEC_ADD({
    key: 'benefit-claim', title: '待遇办理',
    desc: '退休、工伤、生育、失业待遇的申报与进度跟踪，材料清单化、办理节点可视化。',
    metrics: [
      { label: '在办待遇', value: '16', unit: '件', note: '退休 5 · 工伤 1 · 生育 8 · 失业 2', color: '#7659e7' },
      { label: '本月办结', value: '9', unit: '件', note: '办结率 56.3%', color: '#4389ed' },
      { label: '已发放金额', value: '42.6', unit: '万元', note: '含生育津贴 18.6 万', cls: 'up', color: '#1cad9b' },
      { label: '待补材料', value: '3', unit: '件', note: '工伤认定 1 · 失业 2', cls: 'warn', color: '#e5a22a' }
    ],
    columns: [
      { label: '单号', key: 'id', width: '120px' },
      { label: '员工', key: 'name', bold: true, width: '90px' },
      { label: '待遇类型', key: 'type', width: '150px' },
      { label: '单位', key: 'unit', width: '110px' },
      { label: '申报日期', key: 'date', width: '110px' },
      { label: '办理进度', key: 'progress', width: '120px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '100px' }
    ],
    rows: D2.CLAIMS, searchKeys: ['name', 'id', 'type', 'unit'],
    filter: { key: 'type', options: ['退休待遇申报', '工伤认定待遇', '生育津贴申领', '失业金申领'], label: '全部待遇' },
    extra: () => H.panel('待遇申报材料清单', `<div class="dot-list">
      <div class="dot-item"><i></i>退休待遇：身份证、退休审批表、缴费年限核定表、银行卡复印件</div>
      <div class="dot-item"><i></i>工伤待遇：工伤认定决定书、劳动能力鉴定结论、医疗费用票据</div>
      <div class="dot-item"><i></i>生育津贴：出生医学证明、生育服务证、住院票据、单位证明</div>
      <div class="dot-item"><i></i>失业金：解除劳动关系证明、失业保险缴费记录、身份证</div>
    </div>`, '材料一次告知')
  });

  /* ===== 考核体系 ===== */
  window.HR_SPEC_ADD({
    key: 'performance-system', title: '考核体系',
    desc: 'KPI、OKR、360 评估及安全环保、能耗等石化特色指标的设置；按管理层、技术、技能、班组等序列配置考核模板与权重。',
    metrics: [
      { label: '指标库', value: '186', unit: '项', note: 'KPI 86 · OKR 32 · 360 24 · 特色 44', color: '#7659e7' },
      { label: '考核模板', value: '12', unit: '套', note: '按序列配置权重', color: '#4389ed' },
      { label: '覆盖员工', value: '2,846', unit: '人', note: '参与率 100%', cls: 'up', color: '#1cad9b' },
      { label: '一票否决指标', value: '2', unit: '项', note: '安全事故率 · 环保排放', cls: 'danger', color: '#eb6262' }
    ],
    custom: () => {
      const lib = tbl([
        { label: '指标编码', key: 'code' }, { label: '指标名称', key: 'name', render: (r) => `<span class="strong">${H.esc(r.name)}</span>` },
        { label: '类型', render: (r) => H.chip(r.type, r.type === 'KPI' ? 'blue' : r.type === 'OKR' ? 'purple' : 'gray') },
        { label: '权重', key: 'weight' }, { label: '数据来源', key: 'source' }, { label: '一票否决', render: (r) => (r.veto === '是' ? '<span class="status-tag red"><i></i>是</span>' : '<span class="sub">否</span>') }
      ], D2.KPI_LIB);
      const tpl = `<div class="mini-stats" style="grid-template-columns:repeat(2,1fr)">${D2.PERF_TEMPLATES.map((t) => `<div class="mini-stat">
        <b>${t.series} · ${t.count} 人</b>
        <span>KPI ${t.kpi}% · OKR ${t.okr}% · 360 ${t.eval360}%</span>
        <div class="progress-line" style="margin-top:8px"><div class="progress"><span style="width:${t.kpi}%"></span></div><b>${t.special}</b></div></div>`).join('')}</div>`;
      const special = `<div class="chip-wall">${['安全事故率（一票否决）', '隐患整改及时率', '单位产品综合能耗', '环保排放达标率', '非计划停工次数', '检修质量合格率', '承包商安全考核'].map((x) => `<span class="chip ${x.includes('一票否决') ? 'red' : 'blue'}">${x}</span>`).join('')}</div>`;
      return H.mcards([
        { label: '指标库', value: '186', unit: '项', note: 'KPI 86 · OKR 32 · 360 24 · 特色 44', color: '#7659e7' },
        { label: '考核模板', value: '12', unit: '套', note: '按序列配置权重', color: '#4389ed' },
        { label: '覆盖员工', value: '2,846', unit: '人', note: '参与率 100%', cls: 'up', color: '#1cad9b' },
        { label: '一票否决指标', value: '2', unit: '项', note: '安全事故率 · 环保排放', cls: 'danger', color: '#eb6262' }
      ]) + H.panel('指标库（集团统一维护，子公司可引用）', lib, '指标库 186 项 · 模板 12 套')
      + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>考核模板权重（按序列）</h3><span class="panel-extra">4 类序列</span></div>${tpl}</section>
        <section class="panel-card"><div class="panel-header"><h3>石化特色指标（安全环保 · 能耗 · 装置运行）</h3><span class="panel-extra">含 2 项一票否决</span></div>${special}
        <p class="panel-note">特色指标由 HSE、能源计量、DCS/MES 系统自动取数，按季度校准，权重合计不低于 25%；KPI 方式逐步向 360 评估过渡，考核结果与工资核算挂钩，分等结果及权重规则待各单位明确。</p></section></div>`;
    }
  });

  /* ===== 考核流程 ===== */
  window.HR_SPEC_ADD({
    key: 'performance-process', title: '考核流程',
    desc: '目标制定、过程跟踪、自评、上级评、结果校准、绩效面谈全流程管理；考核结果分级（优秀 / 良好 / 合格 / 不合格）与公示申诉。',
    metrics: [
      { label: '本期考核', value: '2,846', unit: '人', note: '2026 年三季度', color: '#7659e7' },
      { label: '已确认', value: '2,412', unit: '人', note: '确认率 84.8%', color: '#4389ed' },
      { label: '校准轮次', value: '3', unit: '轮', note: '部门 / 子公司 / 集团', color: '#1cad9b' },
      { label: '申诉', value: '6', unit: '件', note: '已全部办结', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'process', label: '全流程管理', title: '考核全流程（目标 → 自评 → 上级评 → 校准 → 面谈）',
        columns: [
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.unit)} · ${H.esc(r.dept)}</div></div>`, width: '200px' },
          { label: '自评', render: (r) => `${r.self} 分`, width: '80px', align: 'right' },
          { label: '上级评', render: (r) => `${r.leader} 分`, width: '80px', align: 'right' },
          { label: '当前阶段', key: 'stage', render: (r) => H.chip(r.stage, autoStage(r.stage)), width: '120px' },
          { label: '拟定等级', render: (r) => `<span class="chip ${r.level === 'A' ? 'purple' : r.level === 'B' ? 'blue' : r.level === 'C' ? 'green' : 'red'}">${r.level}</span>`, width: '90px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.PERF_PROCESS, searchKeys: ['name', 'unit', 'dept'],
        filter: { key: 'status', options: ['进行中', '已确认'], label: '全部状态' }
      },
      {
        key: 'public', label: '结果公示', title: '考核结果公示与申诉',
        columns: [
          { label: '单位', key: 'unit', bold: true, width: '110px' },
          { label: '应考核', key: 'total', width: '90px', align: 'right' },
          { label: '已确认', key: 'done', width: '90px', align: 'right' },
          { label: 'A 级', key: 'a', width: '70px', align: 'right' },
          { label: 'D 级', key: 'd', width: '70px', align: 'right' },
          { label: '申诉', key: 'appeal', width: '70px', align: 'right' },
          { label: '公示状态', render: (r) => H.statusTag(r.status), width: '110px' }
        ],
        rows: [
          { unit: '集团本部', total: 386, done: 386, a: 78, d: 12, appeal: 1, status: '公示完成' },
          { unit: '三叶实业', total: 726, done: 702, a: 136, d: 26, appeal: 2, status: '公示中' },
          { unit: '汇丰石化', total: 618, done: 618, a: 118, d: 18, appeal: 1, status: '公示完成' },
          { unit: '翔鑫工贸', total: 452, done: 420, a: 82, d: 16, appeal: 1, status: '公示中' },
          { unit: '维达石化', total: 268, done: 268, a: 48, d: 9, appeal: 0, status: '公示完成' },
          { unit: '宏达人力', total: 246, done: 236, a: 42, d: 8, appeal: 1, status: '公示中' },
          { unit: '兰达工贸', total: 150, done: 150, a: 28, d: 5, appeal: 0, status: '公示完成' }
        ],
        searchKeys: ['unit'], readonly: true
      }
    ],
    extra: () => H.panel('流程规则', `<div class="formula">考核覆盖全员，参与率 100%；等级按强制分布校准：A ≤ 20%、D ≥ 3%，由部门、子公司、集团三级校准会确定。<br>公示期 10-20 ~ 10-24，申诉 6 件已办结；结果 2026-11-01 生效，随 11 月工资兑现。</div>`, '2026 年三季度 · 已校准')
  });

  function autoStage(s) { return /已/.test(s) ? 'green' : /校准|面谈/.test(s) ? 'purple' : 'orange'; }

  /* ===== 结果应用 ===== */
  window.HR_SPEC_ADD({
    key: 'performance-result', title: '结果应用',
    desc: '考核结果分 A / B / C / D 四级，自动联动薪酬、晋升、评优、培训与末等调整，规则一处配置、全集团执行。',
    metrics: [
      { label: '考核覆盖', value: '2,846', unit: '人', note: '参与率 100%', color: '#7659e7' },
      { label: 'A 级人数', value: '512', unit: '人', note: '占比 18%', cls: 'up', color: '#4389ed' },
      { label: 'D 级人数', value: '114', unit: '人', note: '占比 4%', cls: 'danger', color: '#eb6262' },
      { label: '末等调整', value: '26', unit: '人', note: '连续 2 年 D 级', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const heights = [70, 150, 108, 32];
      const levels = `<div class="level-bars">${D2.PERF_RESULT.dist.map((d, i) => `<div class="level-col">
        <b>${d.count}</b><div class="lv-bar" style="height:${heights[i]}px;background:linear-gradient(180deg,${d.color},${d.color}99)"></div>
        <span>${d.pct}%</span><span>${d.level}</span></div>`).join('')}</div>`;
      const links = D2.PERF_RESULT.links.map((l) => `<div class="doc-item" style="cursor:default"><div class="doc-icon">${H.svg('chart')}</div>
        <div class="doc-body"><div class="doc-name">${l.title}</div><div class="doc-sub" style="line-height:1.7">${l.desc}</div></div></div>`).join('');
      return H.mcards([
        { label: '考核覆盖', value: '2,846', unit: '人', note: '参与率 100%', color: '#7659e7' },
        { label: 'A 级人数', value: '512', unit: '人', note: '占比 18%', cls: 'up', color: '#4389ed' },
        { label: 'D 级人数', value: '114', unit: '人', note: '占比 4%', cls: 'danger', color: '#eb6262' },
        { label: '末等调整', value: '26', unit: '人', note: '连续 2 年 D 级', cls: 'warn', color: '#e5a22a' }
      ]) + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>考核等级分布（2026 年三季度）</h3><span class="panel-extra">全员 2,846 人</span></div>
        <div class="donut-wrap" style="justify-content:center"><div class="donut" style="background:conic-gradient(#7055df 0 18%, #4389ed 18% 70%, #14a58b 70% 96%, #eb6262 96% 100%)"><div class="donut-center"><b>A/B/C/D</b><span>强制分布已校准</span></div></div></div>
        ${levels}<p class="panel-note">等级按强制分布校准：A ≤ 20%、D ≥ 3%，由部门、子公司、集团三级校准会确定。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>校准与公示</h3><span class="panel-extra">2026-10</span></div>
          <div class="mini-stats" style="grid-template-columns:1fr 1fr"><div class="mini-stat"><b>3 轮</b><span>部门 / 子公司 / 集团</span></div>
          <div class="mini-stat"><b>10-20 ~ 24</b><span>公示期 · 申诉 6 件</span></div>
          <div class="mini-stat"><b>2026-11-01</b><span>结果生效 · 随工资兑现</span></div>
          <div class="mini-stat"><b>6 件</b><span>申诉办结 · 无复议</span></div></div>
          <p class="panel-note">结果经三级校准与公示后生效，申诉自动转纪检复核，全过程留痕。</p></section></div>`
      + H.panel('考核结果联动应用', `<div class="doc-grid">${links}</div><p class="panel-note">联动规则一处配置、全集团执行；薪酬、晋升、评优、培训、末等调整自动引用考核结果。</p>`, 'A / B / C / D 四级');
    }
  });
})();
