/* 规格：职称 / 培训 / 干部 / 安全 / 关系 / 报表系统 */
(function () {
  const D2 = window.HR_DATA2;
  const H = window.HR_SPEC_HELP;

  function tbl(cols, rows) {
    return `<div class="table-wrap"><table class="hr-table"><thead><tr>${cols.map((c) => `<th${c.width ? ` style="width:${c.width}"` : ''}>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${c.render ? c.render(r) : H.esc(r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  /* ===== 职称管理 ===== */
  window.HR_SPEC_ADD({
    key: 'title-title', title: '职称管理',
    desc: '初级、中级、高级职称的申报、材料审核、评审推荐与聘任；职称等级与津贴标准关联发放。',
    metrics: [
      { label: '在册职称', value: '1,286', unit: '人', note: '正高 38 · 副高 268', color: '#7659e7' },
      { label: '本年度申报', value: '62', unit: '人', note: '评审中 26 人', color: '#4389ed' },
      { label: '评审通过率', value: '76.5', unit: '%', note: '较上年 +4.2%', cls: 'up', color: '#1cad9b' },
      { label: '职称津贴', value: '86', unit: '万元/年', note: '按等级按月发放', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'review', label: '职称评审', title: '职称申报与评审进度',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '职称', key: 'title', width: '150px' },
          { label: '等级', render: (r) => H.chip(r.level, r.level === '正高级' ? 'purple' : r.level === '副高级' ? 'blue' : 'green'), width: '90px' },
          { label: '单位', key: 'unit', width: '110px' },
          { label: '申报日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.TITLE_RECORDS, searchKeys: ['name', 'id', 'title', 'unit'],
        filter: { key: 'level', options: ['正高级', '副高级', '中级', '初级'], label: '全部等级' }
      },
      {
        key: 'allow', label: '职称津贴', title: '职称津贴标准与发放',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '职称', key: 'title', width: '160px' },
          { label: '等级', render: (r) => H.chip(r.level, 'blue'), width: '90px' },
          { label: '津贴标准', key: 'allowance', width: '120px' },
          { label: '聘任状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '发放方式', render: () => '随工资按月发放', width: '160px' }
        ],
        rows: D2.TITLE_RECORDS.filter((t) => t.status === '已聘任'), searchKeys: ['name', 'title'], readonly: true
      }
    ],
    meta: { entity: '职称申报', labels: { id: '单号', name: '员工', title: '职称', level: '等级', unit: '单位', date: '申报日期', status: '状态', allowance: '津贴标准' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'title', label: '申报职称', required: true },
      { key: 'level', label: '职称等级', type: 'select', options: ['初级', '中级', '副高级', '正高级'] }, { key: 'unit', label: '所属单位', type: 'select', options: D2.ORG_UNITS.map((u) => u.name) }
    ] },
    extra: () => H.panel('职称与津贴联动', `<div class="formula">正高级 1,200 元/月 · 副高级 800 元/月 · 中级 500 元/月 · 初级 300 元/月；职称聘任后次月起随工资发放，解聘或调岗后同步停止。</div>`, '自动引用')
  });

  /* ===== 技能等级 ===== */
  window.HR_SPEC_ADD({
    key: 'title-skill', title: '技能等级',
    desc: '初级工、中级工、高级工、技师、高级技师的职业技能鉴定管理；技能等级津贴、首席技师与技能大师工作室管理。',
    metrics: [
      { label: '持证技能人才', value: '1,968', unit: '人', note: '高级工及以上 486 人', color: '#7659e7' },
      { label: '本年鉴定', value: '128', unit: '人', note: '通过 96 人', color: '#4389ed' },
      { label: '首席技师', value: '6', unit: '人', note: '技能大师工作室 2 个', cls: 'up', color: '#1cad9b' },
      { label: '待复核', value: '14', unit: '人', note: '证书到期 / 岗位变动', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'cert', label: '技能鉴定', title: '职业技能等级鉴定台账',
        columns: [
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)} · ${H.esc(r.unit)}</div></div>`, width: '190px' },
          { label: '岗位', key: 'post', width: '130px' },
          { label: '技能等级', render: (r) => H.chip(r.level, r.level === '高级技师' ? 'purple' : r.level === '技师' ? 'blue' : 'green'), width: '110px' },
          { label: '证书', key: 'cert', width: '160px' },
          { label: '认定日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '津贴', key: 'allowance', width: '110px' }
        ],
        rows: D2.SKILL_RECORDS, searchKeys: ['name', 'empNo', 'post'],
        filter: { key: 'level', options: ['高级技师', '技师', '高级工', '中级工'], label: '全部等级' }
      },
      {
        key: 'workshop', label: '技能津贴', title: '技能津贴与工作室',
        columns: [
          { label: '项目', key: 'name', bold: true, width: '180px' },
          { label: '带头人', key: 'leader', width: '110px' },
          { label: '成员', key: 'members', width: '90px', align: 'right' },
          { label: '年度经费', key: 'budget', width: '110px', align: 'right' },
          { label: '主要成果', render: (r) => `<span class="sub">${H.esc(r.result)}</span>`, width: '300px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: [
          { name: '化工总控技能大师工作室', leader: '黄磊', members: 12, budget: '30 万元', result: 'DCS 仿真课程开发、操作法优化 6 项', status: '运行中' },
          { name: '电气仪表技能大师工作室', leader: '周鹏', members: 8, budget: '20 万元', result: '仪表联锁校验标准、故障库 120 条', status: '运行中' },
          { name: '焊接技能大师工作室', leader: '马超', members: 6, budget: '18 万元', result: '特种材料焊接工艺 3 项', status: '筹建中' },
          { name: '首席技师津贴', leader: '黄磊、周鹏等 6 人', members: 6, budget: '28.8 万元', result: '按 4,000 元/月·人发放', status: '执行中' }
        ],
        searchKeys: ['name', 'leader'], readonly: true
      }
    ],
    meta: { entity: '技能等级', labels: { name: '员工', empNo: '工号', unit: '单位', post: '岗位', level: '技能等级', cert: '证书', date: '认定日期', status: '状态', allowance: '津贴' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'post', label: '岗位' }, { key: 'level', label: '技能等级', type: 'select', options: ['初级工', '中级工', '高级工', '技师', '高级技师'] }, { key: 'allowance', label: '津贴标准' }
    ] }
  });

  /* ===== 注册资格 ===== */
  window.HR_SPEC_ADD({
    key: 'title-register', title: '注册资格',
    desc: '注册类证书的注册、延续、变更、注销提醒；注册单位与用工单位一致性校验，到期自动预警。',
    metrics: [
      { label: '注册证书', value: '96', unit: '项', note: '注册安全工程师 38 人', color: '#7659e7' },
      { label: '本年延续', value: '21', unit: '项', note: '已完成 18 项', color: '#4389ed' },
      { label: '30 天内到期', value: '5', unit: '项', note: '已推送提醒', cls: 'warn', color: '#e5a22a' },
      { label: '注册单位一致', value: '96', unit: '%', note: '无异地注册异常', cls: 'up', color: '#1cad9b' }
    ],
    columns: [
      { label: '员工', key: 'name', bold: true, width: '100px' },
      { label: '注册证书', key: 'cert', width: '220px' },
      { label: '证书编号', key: 'no', width: '200px' },
      { label: '注册单位', key: 'unit', width: '120px' },
      { label: '有效期至', key: 'valid', width: '120px' },
      { label: '剩余期限', render: (r) => (r.valid === '长期有效' ? '长期' : '1,246 天'), width: '100px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
    ],
    rows: D2.REGISTER_RECORDS, searchKeys: ['name', 'cert', 'no', 'unit'], entity: '注册证书',
    labels: { name: '员工', cert: '注册证书', no: '证书编号', unit: '注册单位', valid: '有效期至', status: '状态' },
    fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'cert', label: '注册证书', required: true },
      { key: 'no', label: '证书编号' }, { key: 'unit', label: '注册单位' }, { key: 'valid', label: '有效期至' }
    ],
    extra: () => H.panel('注册管理规则', `<div class="dot-list">
      <div class="dot-item"><i></i>注册单位须与用工单位一致，不一致时系统自动预警并冻结证书使用。</div>
      <div class="dot-item"><i></i>到期前 90 / 30 / 7 天推送延续提醒，逾期未延续自动转为“失效”，同步锁定上岗资格。</div>
      <div class="dot-item"><i></i>变更注册单位须提交原单位解聘证明、新单位聘用合同，审批通过后更新电子档案。</div>
    </div>`, '到期自动预警')
  });

  /* ===== 培训管理 ===== */
  window.HR_SPEC_ADD({
    key: 'training-manage', title: '培训管理',
    desc: '培训需求调研、年度培训计划编制、预算管理；课程库、讲师库、开班报名、签到、培训评估与档案归档一体化。',
    metrics: [
      { label: '年度计划', value: '42', unit: '项', note: '本月 6 项 · 待审批 3 项', color: '#7659e7' },
      { label: '年度预算', value: '1,286', unit: '万元', note: '已执行 62%', color: '#4389ed' },
      { label: '本月开班', value: '12', unit: '期', note: '参训 1,246 人次', color: '#1cad9b' },
      { label: '评估均分', value: '90.6', unit: '分', note: '较上期 +1.8', cls: 'up', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'plan', label: '培训计划', title: '培训计划清单（周度 / 月度 / 季度 / 年度）',
        columns: [
          { label: '计划编号', key: 'id', width: '120px' },
          { label: '计划名称', key: 'name', bold: true, width: '230px' },
          { label: '培训事项', render: (r) => `<span class="sub">${H.esc(r.item)}</span>`, width: '240px' },
          { label: '主办部门', key: 'dept', width: '120px' },
          { label: '参与人数', key: 'people', width: '90px', align: 'right' },
          { label: '计划时间', key: 'period', width: '130px' },
          { label: '预算', key: 'budget', width: '90px', align: 'right' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.TRAINING_PLANS, searchKeys: ['name', 'item', 'dept'],
        filter: { key: 'status', options: ['执行中', '待启动', '待审批'], label: '全部状态' }
      },
      {
        key: 'class', label: '培训实施', title: '培训实施清单（开班 · 签到 · 评估）',
        columns: [
          { label: '班次', key: 'name', bold: true, width: '250px' },
          { label: '培训事项', render: (r) => `<span class="sub">${H.esc(r.item)}</span>`, width: '200px' },
          { label: '承办部门', key: 'dept', width: '120px' },
          { label: '参与人数', key: 'people', width: '90px', align: 'right' },
          { label: '开班时间', key: 'period', width: '130px' },
          { label: '签到率', key: 'sign', width: '80px', align: 'center' },
          { label: '评估分', key: 'score', width: '80px', align: 'center' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.TRAINING_CLASSES, searchKeys: ['name', 'dept'], readonly: true
      }
    ],
    meta: { entity: '培训计划', labels: { id: '计划编号', name: '计划名称', item: '培训事项', dept: '主办部门', people: '参与人数', period: '计划时间', budget: '预算', status: '状态' }, fields: [
      { key: 'name', label: '计划名称', required: true }, { key: 'item', label: '培训事项', full: true },
      { key: 'dept', label: '主办部门' }, { key: 'people', label: '参与人数' }, { key: 'period', label: '计划时间' }, { key: 'budget', label: '预算' }
    ] },
    extra: () => H.panel('培训管理流程', `<div class="flow-row">${[['需求调研', '部门申报 + 岗位能力差距分析'], ['计划编制', '周 / 月 / 季 / 年四级计划'], ['预算核定', '人工成本预算内审批'], ['逐级审批', '部门 → 人资 → 财务 → 领导'], ['实施归档', '开班、签到、评估、档案']].map((x, i, a) => `<div class="flow-node"><div class="flow-num">${i + 1}</div><div class="flow-body"><div class="flow-title">${x[0]}</div><div class="flow-desc">${x[1]}</div></div></div>${i < a.length - 1 ? '<div class="flow-arrow"></div>' : ''}`).join('')}</div>`, '四级计划体系')
  });

  /* ===== 安全培训 ===== */
  window.HR_SPEC_ADD({
    key: 'training-safety', title: '安全培训',
    desc: '厂级、车间级、班组级三级安全教育记录与持证上岗管理；特种作业人员取证、复审培训与证件有效期预警。',
    metrics: [
      { label: '三级教育覆盖率', value: '98.2', unit: '%', note: '新员工 100%', cls: 'up', color: '#7659e7' },
      { label: '本年特种培训', value: '268', unit: '人次', note: '复审 96 人', color: '#4389ed' },
      { label: '持证上岗率', value: '99.6', unit: '%', note: '逾期 1 人已停岗', cls: 'warn', color: '#e5a22a' },
      { label: '待复审', value: '18', unit: '人', note: '11 月复审班', cls: 'danger', color: '#eb6262' }
    ],
    tabs: [
      {
        key: 'edu', label: '三级安全教育', title: '各单位三级安全教育完成情况',
        columns: [
          { label: '单位', key: 'unit', bold: true, width: '110px' },
          { label: '在册人数', key: 'total', width: '90px', align: 'right' },
          { label: '厂级完成率', render: (r) => `<div class="progress-line"><div class="progress green"><span style="width:${r.plant}%"></span></div><b>${r.plant}%</b></div>`, width: '150px' },
          { label: '车间级完成率', render: (r) => `<div class="progress-line"><div class="progress ${r.dept < 96 ? 'orange' : 'green'}"><span style="width:${r.dept}%"></span></div><b>${r.dept}%</b></div>`, width: '160px' },
          { label: '班组级完成率', render: (r) => `<div class="progress-line"><div class="progress ${r.team < 95 ? 'orange' : 'green'}"><span style="width:${r.team}%"></span></div><b>${r.team}%</b></div>`, width: '160px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.SAFETY_EDU, searchKeys: ['unit'], readonly: true
      },
      {
        key: 'special', label: '特种培训', title: '特种作业取证 / 复审培训',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '岗位', key: 'post', width: '120px' },
          { label: '证书', key: 'cert', width: '230px' },
          { label: '有效期至', key: 'valid', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '培训安排', render: (r) => `<span class="sub">${H.esc(r.plan)}</span>`, width: '200px' }
        ],
        rows: D2.SPECIAL_TRAINING, searchKeys: ['name', 'cert', 'post'],
        filter: { key: 'status', options: ['有效', '待复审', '逾期'], label: '全部状态' }, readonly: true
      }
    ],
    extra: () => H.panel('三级安全教育要求', `<div class="formula">新员工入职须完成厂级、车间级、班组级三级安全教育，累计不少于 72 学时；考核合格方可上岗。<br>特种作业人员须持有效证书上岗，证书到期前 90 / 30 / 7 天预警，逾期自动停岗并安排复审。</div>`, '安全教育台账')
  });

  /* ===== 人才培养 ===== */
  window.HR_SPEC_ADD({
    key: 'training-develop', title: '人才培养',
    desc: '新员工导师带徒结对、考核与津贴；后备干部、关键岗位继任者培养与轮岗锻炼，形成人才梯队。',
    metrics: [
      { label: '带徒结对', value: '86', unit: '对', note: '在带 62 对', color: '#7659e7' },
      { label: '已出师', value: '24', unit: '人', note: '本年累计', cls: 'up', color: '#1cad9b' },
      { label: '后备干部', value: '186', unit: '人', note: '覆盖 42 个关键岗位', color: '#4389ed' },
      { label: '轮岗锻炼', value: '38', unit: '人', note: '在岗轮岗 12 人', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'mentor', label: '导师带徒', title: '导师带徒结对与考核',
        columns: [
          { label: '导师', key: 'master', bold: true, width: '90px' },
          { label: '徒弟', key: 'apprentice', width: '90px' },
          { label: '岗位', key: 'post', width: '120px' },
          { label: '起始日期', key: 'start', width: '110px' },
          { label: '培养周期', key: 'cycle', width: '90px' },
          { label: '带徒进度', render: (r) => `<div class="progress-line"><div class="progress"><span style="width:${r.progress}%"></span></div><b>${r.progress}%</b></div>`, width: '160px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.MENTOR, searchKeys: ['master', 'apprentice', 'post'],
        filter: { key: 'status', options: ['带徒中', '待考核', '已出师'], label: '全部状态' }, readonly: true
      },
      {
        key: 'talent', label: '人才梯队', title: '后备干部与关键岗位继任',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '单位', key: 'unit', width: '110px' },
          { label: '目标岗位', key: 'post', width: '190px' },
          { label: '梯队类型', render: (r) => H.chip(r.level, r.level === '后备干部' ? 'purple' : r.level === '关键岗位继任' ? 'blue' : 'gray'), width: '120px' },
          { label: '成熟度', key: 'readiness', width: '120px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.TALENT, searchKeys: ['name', 'unit', 'post'],
        filter: { key: 'level', options: ['后备干部', '关键岗位继任', '梯队人才'], label: '全部类型' }, readonly: true
      }
    ],
    extra: () => H.panel('人才培养机制', `<div class="dot-list">
      <div class="dot-item"><i></i>导师带徒：结对 1 年，导师每月 500 元津贴，出师考核合格一次性奖励 2,000 元。</div>
      <div class="dot-item"><i></i>后备干部：按 1:2 比例储备，纳入年度培训、轮岗与项目历练计划。</div>
      <div class="dot-item"><i></i>关键岗位继任：识别继任者成熟度，1 年内可上任者优先安排跨单位轮岗。</div>
    </div>`, '培养与考核联动')
  });

  /* ===== 在线学习 ===== */
  window.HR_SPEC_ADD({
    key: 'training-online', title: '在线学习',
    desc: '线上课程、学时学分管理、学习地图与考试认证；学习数据实时回流，支撑培训统计与人才画像。',
    metrics: [
      { label: '在线课程', value: '86', unit: '门', note: '学时 1,246 节', color: '#7659e7' },
      { label: '在学人数', value: '128', unit: '人', note: '较昨日 +12 人', color: '#4389ed' },
      { label: '本月学习时长', value: '8,642', unit: '小时', note: '人均 3.04 小时', color: '#1cad9b' },
      { label: '课程完成率', value: '68.4', unit: '%', note: '学时达标 1,946 人', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const courses = `<div class="course-grid">${D2.COURSES.map((c) => `<div class="course-card">
        <div class="cover">${H.svg('book')}</div>
        <div class="c-top"><div class="c-title">${H.esc(c.name)}</div>${H.statusTag(c.status)}</div>
        <div class="c-meta">讲师 ${H.esc(c.teacher)} · ${c.hours} 学时 · ${c.learners} 人在学</div>
        <div class="progress-line"><div class="progress ${c.progress < 50 ? 'orange' : ''}"><span style="width:${c.progress}%"></span></div><b>${c.progress}%</b></div>
        <div class="c-foot"><span>继续学习 ›</span><span>${c.status === '已完成' ? '已完成' : '进行中'}</span></div></div>`).join('')}</div>`;
      const stats = tbl([
        { label: '员工', key: 'name', bold: true },
        { label: '部门 / 岗位', key: 'unit' },
        { label: '观看课程', render: (r) => `${r.courses} 门`, align: 'right' },
        { label: '累计时长', render: (r) => `${r.hours} 小时`, align: 'right' },
        { label: '完成率', render: (r) => `<div class="progress-line"><div class="progress green"><span style="width:${r.rate}%"></span></div><b>${r.rate}%</b></div>` }
      ], D2.LEARN_STATS);
      return H.mcards([
        { label: '在线课程', value: '86', unit: '门', note: '学时 1,246 节', color: '#7659e7' },
        { label: '在学人数', value: '128', unit: '人', note: '较昨日 +12 人', color: '#4389ed' },
        { label: '本月学习时长', value: '8,642', unit: '小时', note: '人均 3.04 小时', color: '#1cad9b' },
        { label: '课程完成率', value: '68.4', unit: '%', note: '学时达标 1,946 人', cls: 'warn', color: '#e5a22a' }
      ]) + H.panel('学习课程（线上课程 + 学时学分管理）', courses, '课程 86 门 · 学时 1,246 节')
      + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>在线培训统计</h3><span class="panel-extra">实时 · 128 人</span></div>${stats}
        <p class="panel-note">按单位 / 岗位 / 课程维度明细可导出；学习数据实时回流，支撑培训统计与人才画像。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>学习地图与考试认证</h3><span class="panel-extra">4 条学习地图</span></div>
          <div class="dot-list">
            <div class="dot-item"><i></i>新员工地图：企业文化 → 安全三级教育 → 岗位见习 → 转正考试</div>
            <div class="dot-item"><i></i>技能序列地图：初级工 → 中级工 → 高级工 → 技师，配套仿真操作认证</div>
            <div class="dot-item"><i></i>管理序列地图：班组长 → 主管 → 中层，配套管理案例与绩效面谈</div>
            <div class="dot-item"><i></i>安全地图：年度再培训 → 特种作业复审 → 应急演练认证</div>
          </div>
          <div class="mini-stats" style="grid-template-columns:1fr 1fr;margin-top:14px">
            <div class="mini-stat"><b>1,946 人</b><span>学时达标</span></div>
            <div class="mini-stat"><b>68.4%</b><span>课程完成率</span></div>
            <div class="mini-stat"><b>8,642 h</b><span>本月学习时长</span></div>
            <div class="mini-stat"><b>3.04 h</b><span>人均学习时长</span></div>
          </div></section></div>`;
    }
  });

  /* ===== 干部管理 ===== */
  window.HR_SPEC_ADD({
    key: 'cadre-manage', title: '干部管理',
    desc: '干部选拔、考察、公示、任免、备案的全流程管理；任期制、任期考核、交流轮岗、退出机制记录。',
    metrics: [
      { label: '在任干部', value: '126', unit: '人', note: '集团中层 24 人', color: '#7659e7' },
      { label: '本年任免', value: '18', unit: '人次', note: '提拔 12 · 平调 6', color: '#4389ed' },
      { label: '任期制覆盖', value: '86', unit: '人', note: '任期 3 年 · 到期考核', color: '#1cad9b' },
      { label: '交流轮岗', value: '9', unit: '人', note: '本年度计划 12 人', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'appt', label: '干部任免', title: '干部选拔 / 任免 / 公示',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '干部', key: 'name', bold: true, width: '90px' },
          { label: '原职务', key: 'from', width: '160px' },
          { label: '拟任职务', key: 'to', width: '190px' },
          { label: '类型', key: 'type', render: (r) => H.chip(r.type, 'purple'), width: '80px' },
          { label: '日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '100px' }
        ],
        rows: D2.CADRE_APPT, searchKeys: ['name', 'id', 'from', 'to'],
        filter: { key: 'type', options: ['提拔', '平调', '交流'], label: '全部类型' }
      },
      {
        key: 'term', label: '任期管理', title: '任期制与任期考核',
        columns: [
          { label: '干部', key: 'name', bold: true, width: '90px' },
          { label: '职务', key: 'post', width: '190px' },
          { label: '任期', key: 'term', width: '110px' },
          { label: '起始日期', key: 'start', width: '110px' },
          { label: '到期日期', key: 'end', width: '110px' },
          { label: '任期类型', render: (r) => H.chip(r.status, r.status === '首任' ? 'blue' : 'purple'), width: '90px' },
          { label: '任期考核', render: (r) => `<span class="sub">${H.esc(r.review)}</span>`, width: '160px' }
        ],
        rows: D2.CADRE_TERM, searchKeys: ['name', 'post'], readonly: true
      }
    ],
    meta: { entity: '干部任免单', labels: { id: '单号', name: '干部', from: '原职务', to: '拟任职务', type: '类型', date: '日期', status: '状态' }, fields: [
      { key: 'name', label: '干部姓名', required: true }, { key: 'from', label: '原职务' }, { key: 'to', label: '拟任职务' },
      { key: 'type', label: '任免类型', type: 'select', options: ['提拔', '平调', '交流'] }, { key: 'date', label: '生效日期', type: 'date' }
    ] },
    extra: () => H.panel('干部任免流程', `<div class="flow-row">${[['动议', '党委组织部提出'], ['考察', '民主推荐 + 个别谈话'], ['公示', '5 个工作日'], ['任免', '党委会研究决定'], ['备案', '集团备案归档']].map((x, i, a) => `<div class="flow-node ${i === 2 ? 'active' : ''}"><div class="flow-num">${i + 1}</div><div class="flow-body"><div class="flow-title">${x[0]}</div><div class="flow-desc">${x[1]}</div></div></div>${i < a.length - 1 ? '<div class="flow-arrow"></div>' : ''}`).join('')}</div>`, '全程留痕')
  });

  /* ===== 人才盘点 ===== */
  window.HR_SPEC_ADD({
    key: 'cadre-inventory', title: '人才盘点',
    desc: '按绩效与潜力对人才分类，识别高潜与关键岗位人才；关键岗位继任者储备与培养进度跟踪。',
    metrics: [
      { label: '盘点覆盖', value: '2,846', unit: '人', note: '全员九宫格分布', color: '#7659e7' },
      { label: '高潜人才', value: '186', unit: '人', note: '占比 6.5%', cls: 'up', color: '#4389ed' },
      { label: '关键岗位', value: '42', unit: '个', note: '已储备 38 个', color: '#1cad9b' },
      { label: '继任缺口', value: '4', unit: '个', note: '需外部引进 / 加速培养', cls: 'warn', color: '#e5a22a' }
    ],
    custom: () => {
      const cells = D2.GRID9.map((c) => `<div class="grid9-cell ${c.cls || ''}">
        <div class="g-head"><span>${c.row} · ${c.col}</span><span class="g-tag">${c.label}</span></div>
        <div class="g-names">${c.names.map((n) => `<span class="g-name">${n}</span>`).join('')}</div></div>`).join('');
      const succ = tbl([
        { label: '关键岗位', key: 'post', bold: true }, { label: '单位', key: 'unit' },
        { label: '现任', key: 'incumbent' }, { label: '继任者', key: 'successors' },
        { label: '成熟度', key: 'readiness' }, { label: '状态', render: (r) => H.statusTag(r.status) }
      ], D2.SUCCESSION);
      return H.mcards([
        { label: '盘点覆盖', value: '2,846', unit: '人', note: '全员九宫格分布', color: '#7659e7' },
        { label: '高潜人才', value: '186', unit: '人', note: '占比 6.5%', cls: 'up', color: '#4389ed' },
        { label: '关键岗位', value: '42', unit: '个', note: '已储备 38 个', color: '#1cad9b' },
        { label: '继任缺口', value: '4', unit: '个', note: '需外部引进 / 加速培养', cls: 'warn', color: '#e5a22a' }
      ]) + H.panel('人才九宫格（绩效 × 潜力）', `<div class="grid9">${cells}</div>
        <p class="panel-note">A 区（高绩效 × 高潜力）识别为明星人才，纳入重点培养与继任计划；C 区启动改进或岗位调整。</p>`, '2026 年度盘点 · 绩效与潜力四象限')
      + H.panel('关键岗位继任计划', succ, '42 个关键岗位 · 已储备 38 个');
    }
  });

  /* ===== 政治面貌 ===== */
  window.HR_SPEC_ADD({
    key: 'cadre-political', title: '政治面貌',
    desc: '党员信息、党组织关系转接、党费收缴；党组织覆盖与党员发展管理。',
    metrics: [
      { label: '在册党员', value: '486', unit: '人', note: '占在职 17.1%', color: '#7659e7' },
      { label: '党支部', value: '26', unit: '个', note: '覆盖全部单位', color: '#4389ed' },
      { label: '本月党费', value: '2.86', unit: '万元', note: '收缴率 98.6%', color: '#1cad9b' },
      { label: '发展对象', value: '12', unit: '人', note: '积极分子 26 人', cls: 'warn', color: '#e5a22a' }
    ],
    columns: [
      { label: '员工', key: 'name', bold: true, width: '90px' },
      { label: '单位', key: 'unit', width: '110px' },
      { label: '所属党支部', key: 'branch', width: '220px' },
      { label: '入党时间', key: 'join', width: '110px' },
      { label: '党内职务', key: 'role', width: '120px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
      { label: '党费', key: 'fee', width: '100px', align: 'right' }
    ],
    rows: D2.PARTY, searchKeys: ['name', 'unit', 'branch'], entity: '党员',
    labels: { name: '员工', unit: '单位', branch: '所属党支部', join: '入党时间', role: '党内职务', status: '状态', fee: '党费' },
    fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'branch', label: '所属党支部' },
      { key: 'join', label: '入党时间' }, { key: 'role', label: '党内职务' }
    ],
    extra: () => H.panel('党员管理与组织关系', `<div class="dot-list">
      <div class="dot-item"><i></i>党组织关系转接：省内线上转接 3 个工作日办结，跨省需纸质介绍信 + 线上同步。</div>
      <div class="dot-item"><i></i>党费收缴：按工资比例核定，每月 10 日前自动代扣，收缴率纳入支部考核。</div>
      <div class="dot-item"><i></i>党员发展：入党积极分子 → 发展对象 → 预备党员 → 正式党员，全程纪实。</div>
    </div>`, '党务管理')
  });

  /* ===== 职业健康 ===== */
  window.HR_SPEC_ADD({
    key: 'safety-health', title: '职业健康',
    desc: '岗前、岗中、离岗职业健康体检的组织、结果归档与复查提醒；职业病诊断、鉴定、待遇与康复跟踪，建立职业健康监护档案。',
    metrics: [
      { label: '体检覆盖率', value: '98.4', unit: '%', note: '接触危害人员 100%', cls: 'up', color: '#7659e7' },
      { label: '本年体检', value: '2,412', unit: '人', note: '岗中体检 1,896 人', color: '#4389ed' },
      { label: '复查对象', value: '12', unit: '人', note: '已通知复查', cls: 'warn', color: '#e5a22a' },
      { label: '职业病病例', value: '4', unit: '例', note: '在跟踪 2 例', cls: 'danger', color: '#eb6262' }
    ],
    tabs: [
      {
        key: 'exam', label: '健康监护', title: '职业健康体检台账',
        columns: [
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)} · ${H.esc(r.dept)}</div></div>`, width: '200px' },
          { label: '体检类型', key: 'type', chip: true, width: '100px' },
          { label: '体检日期', key: 'date', width: '110px' },
          { label: '体检结果', render: (r) => H.statusTag(r.result), width: '96px' },
          { label: '下次体检', key: 'next', width: '110px' },
          { label: '监护档案', render: () => H.chip('已归档', 'green'), width: '100px' }
        ],
        rows: D2.HEALTH_EXAMS, searchKeys: ['name', 'empNo', 'unit', 'dept'],
        filter: { key: 'type', options: ['岗前体检', '岗中体检', '离岗体检'], label: '全部类型' }, readonly: true
      },
      {
        key: 'disease', label: '职业病管理', title: '职业病诊断 / 鉴定 / 待遇跟踪',
        columns: [
          { label: '案号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '职业病类型', key: 'type', width: '180px' },
          { label: '阶段', key: 'stage', render: (r) => H.chip(r.stage, 'orange'), width: '100px' },
          { label: '单位', key: 'unit', width: '110px' },
          { label: '诊断日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '110px' }
        ],
        rows: D2.OCC_DISEASE, searchKeys: ['name', 'id', 'type'], readonly: true
      }
    ],
    extra: () => H.panel('职业健康监护要求', `<div class="formula">接触职业病危害因素人员须做到岗前、岗中（每年 1 次）、离岗体检三个 100%；体检结果异常 15 个工作日内通知本人复查。<br>职业病诊断须由省级以上卫生行政部门批准的医疗机构出具，鉴定结论归档并同步待遇申报。</div>`, '一人一档')
  });

  /* ===== 劳保管理 ===== */
  window.HR_SPEC_ADD({
    key: 'safety-labor', title: '劳保管理',
    desc: '劳保用品发放标准、领用记录与周期提醒；按岗位危害因素配置防护用品，未按规定佩戴纳入安全考核。',
    metrics: [
      { label: '劳保标准', value: '28', unit: '类', note: '按岗位危害因素配置', color: '#7659e7' },
      { label: '本年发放', value: '2,846', unit: '人次', note: '发放金额 286 万元', color: '#4389ed' },
      { label: '待更换', value: '36', unit: '人', note: '30 天内到期', cls: 'warn', color: '#e5a22a' },
      { label: '领用异常', value: '2', unit: '起', note: '超标准领用已核查', cls: 'danger', color: '#eb6262' }
    ],
    columns: [
      { label: '员工', key: 'name', bold: true, width: '90px' },
      { label: '单位', key: 'unit', width: '110px' },
      { label: '劳保用品', key: 'item', width: '220px' },
      { label: '发放标准', key: 'standard', width: '110px' },
      { label: '发放日期', key: 'date', width: '110px' },
      { label: '下次更换', key: 'next', width: '110px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
    ],
    rows: D2.LABOR_GOODS, searchKeys: ['name', 'item', 'unit'], entity: '劳保发放记录',
    labels: { name: '员工', unit: '单位', item: '劳保用品', standard: '发放标准', date: '发放日期', next: '下次更换', status: '状态' },
    fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'item', label: '劳保用品', required: true },
      { key: 'standard', label: '发放标准' }, { key: 'date', label: '发放日期', type: 'date' }
    ],
    extra: () => H.panel('劳保用品发放标准', `<div class="chip-wall">${[['安全帽', '1 顶/2 年'], ['防护鞋', '1 双/年'], ['防酸碱服', '1 套/2 年'], ['绝缘手套', '1 副/半年'], ['防毒面具', '1 套/年'], ['正压式呼吸器', '1 台/3 年'], ['安全带', '1 套/2 年'], ['防噪声耳罩', '1 副/年']].map((x) => `<span class="chip blue">${x[0]} ${x[1]}</span>`).join('')}</div>`, '按岗位危害因素配置')
  });

  /* ===== 安全积分 ===== */
  window.HR_SPEC_ADD({
    key: 'safety-score', title: '安全积分',
    desc: '安全违章记录、安全积分、安全绩效与奖惩联动；违章分级处理，积分与评优、晋升挂钩。',
    metrics: [
      { label: '本月违章', value: '18', unit: '起', note: '较上月 -4 起', cls: 'up', color: '#7659e7' },
      { label: '安全积分均值', value: '86', unit: '分', note: '满分 100 分', color: '#4389ed' },
      { label: '停岗培训', value: '2', unit: '人', note: '违章累计超 10 分', cls: 'danger', color: '#eb6262' },
      { label: '安全奖励', value: '12', unit: '人次', note: '发现隐患 / 制止违章', color: '#e5a22a' }
    ],
    columns: [
      { label: '单号', key: 'id', width: '120px' },
      { label: '员工', key: 'name', bold: true, width: '90px' },
      { label: '单位', key: 'unit', width: '110px' },
      { label: '违章 / 奖励事项', render: (r) => `<span class="sub">${H.esc(r.event)}</span>`, width: '280px' },
      { label: '积分变动', render: (r) => `<span class="status-tag ${r.points > 0 ? 'green' : 'red'}"><i></i>${r.points > 0 ? '+' + r.points : r.points}</span>`, width: '96px' },
      { label: '日期', key: 'date', width: '110px' },
      { label: '处理措施', key: 'action', width: '120px' }
    ],
    rows: D2.SAFETY_SCORE, searchKeys: ['name', 'event', 'unit'], entity: '安全积分记录',
    labels: { id: '单号', name: '员工', unit: '单位', event: '事项', points: '积分变动', date: '日期', action: '处理措施', status: '状态' },
    fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'event', label: '违章 / 奖励事项', full: true },
      { key: 'points', label: '积分变动' }, { key: 'action', label: '处理措施' }
    ],
    extra: () => H.panel('安全积分规则', `<div class="formula">安全积分满分 100 分，违章按风险等级扣 2–10 分，发现隐患 / 制止违章加 5–10 分；年度累计扣分超 10 分停岗培训，超 20 分解除劳动合同。<br>积分与评优评先、晋升、安全奖直接挂钩，按月公示。</div>`, '安全绩效联动')
  });

  /* ===== 员工关系 ===== */
  window.HR_SPEC_ADD({
    key: 'relation-relation', title: '员工关系',
    desc: '表彰、记功、处分、通报等奖惩事项的登记与归档；劳动模范、先进个人、先进集体评选；员工意见、申诉、举报的受理与处理跟踪。',
    metrics: [
      { label: '本年奖惩', value: '86', unit: '项', note: '表彰 62 · 处分 24', color: '#7659e7' },
      { label: '评优评先', value: '96', unit: '人', note: '劳模 12 · 先进 84', cls: 'up', color: '#1cad9b' },
      { label: '在办申诉', value: '1', unit: '件', note: '薪酬申诉处理中', cls: 'warn', color: '#e5a22a' },
      { label: '申诉办结率', value: '94', unit: '%', note: '平均 5.2 个工作日', color: '#4389ed' }
    ],
    tabs: [
      {
        key: 'reward', label: '奖惩管理', title: '奖惩事项登记与归档',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '类型', render: (r) => H.chip(r.type, r.type === '处分' ? 'red' : 'purple'), width: '80px' },
          { label: '事项', render: (r) => `<span class="sub">${H.esc(r.content)}</span>`, width: '330px' },
          { label: '日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.REWARDS, searchKeys: ['name', 'content', 'id'],
        filter: { key: 'type', options: ['表彰', '记功', '处分'], label: '全部类型' }
      },
      {
        key: 'honor', label: '评优评先', title: '劳动模范 / 先进个人 / 先进集体评选',
        columns: [
          { label: '单号', key: 'id', width: '100px' },
          { label: '对象', key: 'name', bold: true, width: '160px' },
          { label: '荣誉', key: 'honor', width: '150px' },
          { label: '级别', key: 'level', render: (r) => H.chip(r.level, r.level === '集团级' ? 'purple' : 'blue'), width: '100px' },
          { label: '评选日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.HONORS, searchKeys: ['name', 'honor'], readonly: true
      },
      {
        key: 'appeal', label: '员工申诉', title: '员工意见 / 申诉 / 举报受理',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '类型', key: 'type', chip: true, width: '110px' },
          { label: '内容', render: (r) => `<span class="sub">${H.esc(r.content)}</span>`, width: '300px' },
          { label: '日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '承办人', key: 'owner', width: '90px' }
        ],
        rows: D2.APPEALS, searchKeys: ['name', 'content', 'type'], readonly: true
      }
    ],
    meta: { entity: '奖惩记录', labels: { id: '单号', name: '员工', type: '类型', content: '事项', date: '日期', status: '状态' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '类型', type: 'select', options: ['表彰', '记功', '处分'] },
      { key: 'content', label: '事项', full: true }, { key: 'date', label: '日期', type: 'date' }
    ] }
  });

  /* ===== 关怀服务 ===== */
  window.HR_SPEC_ADD({
    key: 'relation-care', title: '关怀服务',
    desc: '生日、节日、婚育、住院慰问及困难职工帮扶；离退休人员信息、活动、待遇发放与关怀管理。',
    metrics: [
      { label: '本年慰问', value: '286', unit: '人次', note: '金额 42.6 万元', color: '#7659e7' },
      { label: '困难帮扶', value: '24', unit: '人', note: '帮扶金 18.2 万元', color: '#4389ed' },
      { label: '离退休人员', value: '486', unit: '人', note: '返聘 12 人', color: '#1cad9b' },
      { label: '待办慰问', value: '8', unit: '项', note: '本月生日 / 节日', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'care', label: '慰问帮扶', title: '慰问 / 帮扶记录',
        columns: [
          { label: '单号', key: 'id', width: '100px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '类型', render: (r) => H.chip(r.type, r.type === '困难帮扶' ? 'orange' : 'purple'), width: '110px' },
          { label: '日期', key: 'date', width: '110px' },
          { label: '内容', render: (r) => `<span class="sub">${H.esc(r.detail)}</span>`, width: '280px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.CARE, searchKeys: ['name', 'type', 'detail'],
        filter: { key: 'type', options: ['生日慰问', '节日慰问', '住院慰问', '婚育慰问', '困难帮扶'], label: '全部类型' }
      },
      {
        key: 'retire', label: '离退休服务', title: '离退休人员管理与关怀',
        columns: [
          { label: '单号', key: 'id', width: '100px' },
          { label: '姓名', key: 'name', bold: true, width: '90px' },
          { label: '原单位', key: 'unit', width: '110px' },
          { label: '退休日期', key: 'retireDate', width: '110px' },
          { label: '退休类型', render: (r) => H.chip(r.type, r.type === '返聘' ? 'purple' : 'gray'), width: '110px' },
          { label: '关怀活动', key: 'activity', width: '160px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '100px' }
        ],
        rows: D2.RETIREES, searchKeys: ['name', 'unit'], readonly: true
      }
    ],
    meta: { entity: '慰问记录', labels: { id: '单号', name: '员工', type: '类型', date: '日期', detail: '内容', status: '状态' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '类型', type: 'select', options: ['生日慰问', '节日慰问', '住院慰问', '婚育慰问', '困难帮扶'] },
      { key: 'detail', label: '内容', full: true }, { key: 'date', label: '日期', type: 'date' }
    ] }
  });

  /* ===== 统计分析 ===== */
  window.HR_SPEC_ADD({
    key: 'system-analysis', title: '统计分析',
    desc: '人力报表、人工成本、数据看板三类分析，图表自动取数、一键下钻；支持自定义数据、算法与展示方式。',
    metrics: [
      { label: '在册员工', value: '2,846', unit: '人', note: '+2.1%', cls: 'up', color: '#7659e7' },
      { label: '年度人工成本', value: '1.84', unit: '亿', note: '+6.4%', color: '#4389ed' },
      { label: '人均人工成本', value: '6.47', unit: '万', note: '+4.2%', color: '#1cad9b' },
      { label: '人工成本率', value: '12.8', unit: '%', note: '-0.6pt', color: '#e5a22a' }
    ],
    custom: () => {
      const units = D2.REPORT_UNITS.map((u) => `<div class="bar-item"><span class="b-label">${u.unit}</span>
        <div class="bar-track"><span class="bar-fill blue" style="width:${u.pct * 3.4}%"></span></div><b>${u.people}</b></div>`).join('');
      const costRows = `<div class="bar-list">${D2.COST_STRUCT.map((c) => `<div class="bar-item"><span class="b-label">${c.name}</span>
        <div class="bar-track"><span class="bar-fill" style="width:${c.pct}%;background:linear-gradient(90deg,${c.color},${c.color}bb)"></span></div><b>${c.pct}%</b></div>`).join('')}</div>`;
      return H.mcards([
        { label: '在册员工', value: '2,846', unit: '人', note: '+2.1%', cls: 'up', color: '#7659e7' },
        { label: '年度人工成本', value: '1.84', unit: '亿', note: '+6.4%', color: '#4389ed' },
        { label: '人均人工成本', value: '6.47', unit: '万', note: '+4.2%', color: '#1cad9b' },
        { label: '人工成本率', value: '12.8', unit: '%', note: '-0.6pt', color: '#e5a22a' }
      ]) + `<div class="two-columns"><section class="panel-card"><div class="panel-header"><h3>人力报表 · 各单位在册人数</h3><span class="panel-extra">7 家单位 · 2,846 人</span></div>${units}
        <p class="panel-note">另可一键切换：人员结构、编制执行率、年龄学历、工龄分布、流失率等 18 张常规报表。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>人工成本 · 年度构成</h3><span class="panel-extra">2026 年度</span></div>${costRows}
        <p class="panel-note">人均人工成本 6.47 万元 · 成本率 12.8%。</p></section></div>`
      + H.panel('自定义报表', `<div class="two-columns" style="grid-template-columns:1fr 1fr 1fr">
          <div><div class="section-title"><span class="bar"></span>① 选择数据</div><div class="chip-wall"><span class="chip purple">在册人数</span><span class="chip purple">人工成本</span><span class="chip purple">离职率</span><span class="chip gray">编制执行率</span><span class="chip gray">年龄结构</span></div></div>
          <div><div class="section-title"><span class="bar"></span>② 选择算法</div><div class="chip-wall"><span class="chip blue">求和</span><span class="chip blue">平均值</span><span class="chip gray">同比</span><span class="chip gray">占比</span></div></div>
          <div><div class="section-title"><span class="bar"></span>③ 展示方式</div><div class="chip-wall"><span class="chip green">柱状图</span><span class="chip green">折线图</span><span class="chip gray">看板卡</span></div></div>
        </div><div style="margin-top:14px;display:flex;gap:10px"><button class="btn primary" data-act="toast" data-id="报表已生成">生成报表</button><button class="btn" data-act="toast" data-id="模板已保存">存为模板</button></div>`, '领导驾驶舱 · 支持下钻')
      + H.panel('数据看板（领导驾驶舱）', `<div class="mini-stats">${D2.REPORT_KPIS.map((k) => `<div class="mini-stat"><b>${k.value}</b><span>${k.label}　${k.note}</span></div>`).join('')}</div>
        <p class="panel-note">数据取自 2026 年 10 月人力报表，支持按月 / 季 / 年切换与逐级下钻至单位。</p>`, '近 12 个月');
    }
  });

  /* ===== 系统管理 ===== */
  window.HR_SPEC_ADD({
    key: 'system-admin', title: '系统管理',
    desc: '角色权限、数据权限（按机构 / 部门隔离）、字段级权限；审批流引擎、表单设计器、消息通知与待办提醒；数据字典、编码规则、系统参数、节假日日历；与财务、ERP、门禁、钉钉 / 飞书集成及操作日志审计。',
    metrics: [
      { label: '角色', value: '6', unit: '个', note: '覆盖 2,846 名用户', color: '#7659e7' },
      { label: '审批流', value: '32', unit: '条', note: '启用 28 条', color: '#4389ed' },
      { label: '系统参数', value: '86', unit: '项', note: '本月变更 3 项', color: '#1cad9b' },
      { label: '审计日志', value: '12,846', unit: '条', note: '近 30 天', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'perm', label: '权限管理', title: '角色权限与数据范围',
        columns: [
          { label: '角色', key: 'role', bold: true, width: '140px' },
          { label: '说明', render: (r) => `<span class="sub">${H.esc(r.desc)}</span>`, width: '300px' },
          { label: '数据范围', key: 'scope', width: '220px' },
          { label: '用户数', key: 'count', width: '90px', align: 'right' },
          { label: '操作', render: () => '<button class="link-btn" data-act="toast" data-id="角色权限配置已打开（演示）">配置权限</button>', width: '100px' }
        ],
        rows: D2.PERMISSIONS, searchKeys: ['role', 'desc'], readonly: true
      },
      {
        key: 'flow', label: '流程配置', title: '审批流配置',
        columns: [
          { label: '流程编号', key: 'id', width: '100px' },
          { label: '流程名称', key: 'name', bold: true, width: '190px' },
          { label: '审批节点', render: (r) => `<span class="sub">${H.esc(r.steps)}</span>`, width: '360px' },
          { label: '节点数', key: 'nodes', width: '80px', align: 'center' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '80px' },
          { label: '更新时间', key: 'updated', width: '110px' }
        ],
        rows: D2.WORKFLOWS, searchKeys: ['name', 'id'], readonly: true
      },
      {
        key: 'config', label: '基础配置', title: '数据字典 / 编码规则 / 系统参数',
        columns: [
          { label: '编号', key: 'id', width: '90px' },
          { label: '配置项', key: 'name', bold: true, width: '180px' },
          { label: '配置值', render: (r) => `<span class="sub">${H.esc(r.value)}</span>`, width: '420px' },
          { label: '更新时间', key: 'updated', width: '110px' },
          { label: '操作', render: () => '<button class="link-btn" data-act="toast" data-id="配置项已打开编辑（演示）">编辑</button>', width: '80px' }
        ],
        rows: D2.CONFIGS, searchKeys: ['name', 'value'], readonly: true
      },
      {
        key: 'audit', label: '集成与审计', title: '操作日志与审计追踪',
        columns: [
          { label: '日志编号', key: 'id', width: '120px' },
          { label: '操作人', key: 'user', width: '90px' },
          { label: '操作', key: 'action', width: '160px' },
          { label: '对象', render: (r) => `<span class="sub">${H.esc(r.object)}</span>`, width: '200px' },
          { label: 'IP', key: 'ip', width: '140px' },
          { label: '时间', key: 'time', width: '150px' },
          { label: '结果', render: (r) => H.statusTag(r.result === '成功' ? '成功' : '失败'), width: '80px' }
        ],
        rows: D2.AUDIT, searchKeys: ['user', 'action', 'object'], readonly: true
      }
    ],
    extra: () => H.panel('系统集成', `<div class="chip-wall">${['财务系统（凭证 / 成本）', 'ERP（机构 / 岗位 / 人员）', '门禁系统（打卡数据）', '钉钉 / 飞书（消息 / 待办）', '社保网上申报平台', '电子签章平台'].map((x) => `<span class="chip blue">${x}</span>`).join('')}</div>
      <p class="panel-note">所有集成接口均记录调用日志与失败重试；操作日志保留 3 年，支持按用户 / 对象 / 时间检索。</p>`, '接口 6 类 · 审计留痕')
  });
})();
