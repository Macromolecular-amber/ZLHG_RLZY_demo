/* 规格：组织机构 / 员工异动 / 工龄 / 合同 / 招聘 */
(function () {
  const D2 = window.HR_DATA2;
  const H = window.HR_SPEC_HELP;

  /* ===== 组织机构 · 概览 ===== */
  window.HR_SPEC_ADD({
    key: 'org-overview', title: '组织机构管理',
    desc: '集团—分公司—生产厂—车间—班组五级机构树，7 家法人单位、386 个机构节点统一管控；子公司人资入口数据与权限按单位隔离。',
    metrics: [
      { label: '集团法人单位', value: '7', unit: '家', note: '集团本部 + 6 家子公司', color: '#7659e7' },
      { label: '机构节点', value: '386', unit: '个', note: '五级机构树', color: '#4389ed' },
      { label: '岗位总数', value: '1,246', unit: '个', note: '管理 / 技术 / 技能三通道', color: '#1cad9b' },
      { label: '核定编制', value: '3,000', unit: '人', note: '在册 2,846 人 · 执行率 94.9%', cls: 'up', color: '#e5a22a' }
    ],
    custom: () => {
      const scoped = window.HR_SCOPE ? window.HR_SCOPE.unit() : null;
      const list = scoped ? D2.ORG_UNITS.filter((u) => u.name === scoped) : D2.ORG_UNITS;
      const cur = scoped ? (list[0] || {}) : null;
      const units = list.map((u) => `<div class="unit-card" data-act="unit" data-id="${u.name}">
        <div class="u-name">${u.name}</div><div class="u-full">${H.esc(u.full)}</div>
        <div class="u-desc">${H.esc(u.desc)}</div>
        <div class="u-foot"><span>在册 <b>${u.staff}</b> 人 · 机构 ${u.nodes}</span><span>切换进入 ›</span></div></div>`).join('');
      return H.mcards(scoped ? [
        { label: '当前单位', value: window.HR_SCOPE.session.unit, note: '系统按账号识别', color: '#7659e7' },
        { label: '本单位机构', value: String(cur.nodes || '—'), unit: '个', note: '数据按单位隔离', color: '#4389ed' },
        { label: '本单位岗位', value: String(cur.positions || '—'), unit: '个', note: '集团标准 · 本单位执行', color: '#1cad9b' },
        { label: '本单位在册', value: String(cur.staff || '—'), unit: '人', note: '仅本单位数据可见', cls: 'up', color: '#e5a22a' }
      ] : [
        { label: '集团法人单位', value: '7', unit: '家', note: '集团本部 + 6 家子公司', color: '#7659e7' },
        { label: '机构节点', value: '386', unit: '个', note: '五级机构树', color: '#4389ed' },
        { label: '岗位总数', value: '1,246', unit: '个', note: '三通道管理', color: '#1cad9b' },
        { label: '在册员工', value: '2,846', unit: '人', note: '编制执行率 94.9%', cls: 'up', color: '#e5a22a' }
      ]) + H.panel(scoped ? '本单位组织信息' : '子公司人资管理入口', `<p class="note-line" style="margin:0 0 14px">${scoped ? '当前账号已自动识别所属单位，仅可查看本单位机构与人员数据。' : '点击卡片即切换至该单位人资管理界面 —— 功能架构与本系统完全一致，数据与权限按单位隔离。'}</p><div class="unit-grid">${units}</div>`, scoped ? '数据按单位隔离' : '6 家子公司 · 权限隔离');
    }
  });

  /* ===== 组织架构维护 ===== */
  function treeHTML(node, depth) {
    const kids = node.children && node.children.length
      ? `<div class="t-children">${node.children.map((c) => treeHTML(c, depth + 1)).join('')}</div>` : '';
    return `<details class="tree-node" ${depth < 2 ? 'open' : ''}>
      <summary class="t-row"><svg class="ico t-icon"><use href="#i-building"/></svg>
        <span>${H.esc(node.name)}</span><span class="sub">${node.code}</span><span class="t-count">${node.count} 人</span></summary>
      ${kids}</details>`;
  }
  function simpleTable(cols, rows) {
    return `<div class="table-wrap"><table class="hr-table"><thead><tr>${cols.map((c) => `<th>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((r) => `<tr>${cols.map((c) => `<td>${c.render ? c.render(r) : H.esc(r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }

  window.HR_SPEC_ADD({
    key: 'org-structure', title: '组织架构维护',
    desc: '支持集团—分公司—生产厂—车间—班组多级机构树的增删改查与层级调整；机构新增、合并、撤销、划转全流程审批，保留历史版本与生效日期；按统一编码规则生成机构代码，与财务、ERP 保持一致。',
    metrics: [
      { label: '机构节点', value: '386', unit: '个', note: '五级机构树', color: '#7659e7' },
      { label: '本月变更', value: '8', unit: '项', note: '新增 2 · 合并 2 · 划转 2', color: '#4389ed' },
      { label: '待审批变更', value: '1', unit: '项', note: '维达石化检维修划转', cls: 'warn', color: '#e5a22a' },
      { label: '历史版本', value: '11', unit: '个', note: '保留生效日期与审批记录', color: '#1cad9b' }
    ],
    custom: () => {
      const scoped = window.HR_SCOPE ? window.HR_SCOPE.unit() : null;
      const changesData = scoped ? D2.ORG_CHANGES.filter((r) => !r.unit || String(r.unit).indexOf(scoped) >= 0) : D2.ORG_CHANGES;
      const root = scoped ? ((D2.ORG_TREE.children || []).find((c) => c.name === scoped) || D2.ORG_TREE) : D2.ORG_TREE;
      const changes = simpleTable([
        { label: '单号', key: 'id' }, { label: '类型', key: 'type' }, { label: '单位', key: 'unit' },
        { label: '变更内容', render: (r) => `<span class="sub">${r.content}</span>` },
        { label: '生效日期', key: 'date' }, { label: '状态', render: (r) => H.statusTag(r.status) }
      ], changesData);
      const codes = simpleTable([
        { label: '机构', key: 'object' }, { label: '机构编码', render: (r) => `<span class="num strong">${r.code}</span>` },
        { label: '编码规则', key: 'rule' }, { label: '最近更新', key: 'updated' }
      ], D2.ORG_CODES);
      return `<div class="two-columns" style="grid-template-columns:minmax(0,420px) minmax(0,1fr)">
        <section class="panel-card"><div class="panel-header"><h3>机构树维护</h3><span class="panel-extra">386 个节点</span></div>
          <div class="org-tree">${treeHTML(root, 0)}</div>
          <p class="panel-note">点击节点展开 / 收起；支持机构新增、合并、撤销、划转与层级调整，变更须走审批并保留历史版本。</p></section>
        <section class="panel-card"><div class="panel-header"><h3>机构变更管理</h3><span class="panel-extra">保留历史版本与生效日期</span></div>
          ${changes}<p class="panel-note">变更审批通过后自动生成新版本，生效日期前可回滚；与财务、ERP 机构编码保持同步。</p></section>
      </div>
      <section class="panel-card"><div class="panel-header"><h3>机构编码管理</h3><span class="panel-extra">统一编码规则 · 与财务 / ERP 一致</span></div>${codes}</section>`;
    },
    introOnly: true
  });

  /* ===== 岗位与编制管理 ===== */
  window.HR_SPEC_ADD({
    key: 'org-position', title: '岗位与编制管理',
    desc: '建立管理、技术、技能三条职业通道及岗位序列、职级、职等标准；按机构设置岗位编制数，实时监控超编、缺编并预警；维护岗位职责、任职资格、考核指标，支持版本管理。',
    metrics: [
      { label: '岗位总数', value: '1,246', unit: '个', note: '三条职业通道', color: '#7659e7' },
      { label: '核定编制', value: '3,000', unit: '人', note: '集团统一下达', color: '#4389ed' },
      { label: '超编岗位', value: '9', unit: '个', note: '主要集中在技能序列', cls: 'warn', color: '#e5a22a' },
      { label: '缺编岗位', value: '23', unit: '个', note: '已纳入招聘计划', color: '#eb6262' }
    ],
    tabs: [
      {
        key: 'post', label: '岗位体系维护', title: '岗位体系（管理 / 技术 / 技能三通道）',
        columns: [
          { label: '岗位名称', key: 'name', bold: true, width: '180px' },
          { label: '通道', key: 'channel', chip: true, width: '80px' },
          { label: '岗位序列', key: 'series', width: '120px' },
          { label: '职级职等', key: 'level', width: '90px' },
          { label: '所属单位', key: 'unit', width: '100px' },
          { label: '编制数', key: 'approved', width: '80px', align: 'right' },
          { label: '在职数', key: 'current', width: '80px', align: 'right' },
          { label: '超缺编', render: (r) => (r.gap > 0 ? `<span class="status-tag red"><i></i>超编 ${r.gap}</span>` : r.gap < 0 ? `<span class="status-tag green"><i></i>缺编 ${-r.gap}</span>` : '<span class="sub">满编</span>'), width: '110px' }
        ],
        rows: D2.POSITIONS, searchKeys: ['name', 'series', 'unit'],
        filter: { key: 'channel', options: ['管理', '技术', '技能'], label: '全部通道' }
      },
      {
        key: 'staff', label: '定编定员管理', title: '定编定员监控（超编 / 缺编实时预警）',
        columns: [
          { label: '岗位', key: 'name', bold: true, width: '180px' },
          { label: '单位', key: 'unit', width: '110px' },
          { label: '编制', key: 'approved', width: '80px', align: 'right' },
          { label: '在职', key: 'current', width: '80px', align: 'right' },
          { label: '编制执行率', render: (r) => { const p = Math.round(r.current / r.approved * 100); return `<div class="progress-line"><div class="progress ${p > 100 ? 'red' : p < 90 ? 'orange' : 'green'}"><span style="width:${Math.min(p, 100)}%"></span></div><b>${p}%</b></div>`; }, width: '180px' },
          { label: '预警', render: (r) => (r.gap > 0 ? `<span class="chip red">超编 ${r.gap} 人</span>` : r.gap < -2 ? `<span class="chip orange">缺编 ${-r.gap} 人</span>` : `<span class="chip green">正常</span>`), width: '110px' }
        ],
        rows: D2.POSITIONS, searchKeys: ['name', 'unit'],
        filter: { key: 'unit', options: D2.ORG_UNITS.map((u) => u.name), label: '全部单位' }
      },
      {
        key: 'doc', label: '岗位说明书', title: '岗位说明书与版本管理',
        columns: [
          { label: '岗位', key: 'name', bold: true, width: '180px' },
          { label: '版本号', key: 'doc', width: '100px' },
          { label: '岗位职责', render: (r) => `<span class="sub">${r.channel === '技能' ? '按操作规程完成本岗位生产 / 检修作业' : '负责本专业业务管理与技术支撑'}</span>`, width: '300px' },
          { label: '任职资格', render: (r) => `<span class="sub">${r.channel === '技能' ? '中级工及以上 + 特种作业证' : r.channel === '技术' ? '本科及以上 + 中级职称' : '本科及以上 + 3 年管理经验'}</span>`, width: '260px' },
          { label: '考核指标', render: (r) => (r.channel === '技能' ? '安全操作、装置平稳率' : '任务达成率、协作满意度'), width: '200px' },
          { label: '状态', render: () => H.statusTag('已发布'), width: '90px' }
        ],
        rows: D2.POSITIONS, searchKeys: ['name'],
        filter: { key: 'channel', options: ['管理', '技术', '技能'], label: '全部通道' }
      }
    ],
    meta: { entity: '岗位', labels: { name: '岗位名称', channel: '通道', series: '岗位序列', level: '职级职等', unit: '所属单位', approved: '编制数', current: '在职数', gap: '超缺编', doc: '说明书版本' }, fields: [
      { key: 'name', label: '岗位名称', required: true }, { key: 'channel', label: '通道', type: 'select', options: ['管理', '技术', '技能'] },
      { key: 'series', label: '岗位序列' }, { key: 'level', label: '职级职等' }, { key: 'unit', label: '所属单位', type: 'select', options: D2.ORG_UNITS.map((u) => u.name) },
      { key: 'approved', label: '编制数' }, { key: 'current', label: '在职数' }
    ] }
  });

  /* ===== 职位职级体系 ===== */
  window.HR_SPEC_ADD({
    key: 'org-rank', title: '职位职级体系',
    desc: '建立职级与薪酬档级、干部级别的对应关系；输出职级映射表，支撑薪酬核算、干部任免与岗位说明书版本管理。',
    metrics: [
      { label: '职级层级', value: '24', unit: '级', note: '管理 M / 技术 T / 技能 S', color: '#7659e7' },
      { label: '映射规则', value: '36', unit: '条', note: '职级 → 薪酬档级 → 干部级别', color: '#4389ed' },
      { label: '已覆盖岗位', value: '1,246', unit: '个', note: '覆盖率 100%', cls: 'up', color: '#1cad9b' },
      { label: '待校准职级', value: '3', unit: '个', note: '2026 年度体系优化', cls: 'warn', color: '#e5a22a' }
    ],
    columns: [
      { label: '职级', key: 'level', bold: true, width: '90px' },
      { label: '职级名称', key: 'name', width: '140px' },
      { label: '薪酬档级', key: 'band', width: '160px' },
      { label: '干部级别', key: 'cadre', width: '140px' },
      { label: '典型岗位', key: 'positions', width: '190px' },
      { label: '在岗人数', key: 'count', width: '90px', align: 'right' }
    ],
    rows: D2.RANKS, searchKeys: ['name', 'level', 'positions'], entity: '职级',
    metricsNote: '职级映射表',
    labels: { level: '职级', name: '职级名称', band: '薪酬档级', cadre: '干部级别', positions: '典型岗位', count: '在岗人数' },
    extra: () => H.panel('职级映射规则', `<div class="formula">管理通道 M4–M1：对应薪酬档级 24–10 档、干部级别集团班子 / 中层 / 基层；技术通道 T4–T1：对应薪酬档级 21–10 档；技能通道 S4–S1：对应薪酬档级 15–8 档。<br>职级晋升须满足任职年限、绩效等级与资格条件，由集团人力资源部统一核定。</div>`, 'V2026.1')
  });

  /* ===== 员工异动 ===== */
  window.HR_SPEC_ADD({
    key: 'transfer-flow', title: '入转调离',
    desc: '入职、转正、调动、离职全流程线上审批；系统提前 30 天扫描即将变动人员，自动推送提醒至 HR 与部门负责人；报到、资料收集、体检、建档、工牌、账号开通一站式办理。',
    metrics: [
      { label: '入职办理', value: '28', unit: '人', note: '本月 · 待建档 4 人', color: '#7659e7' },
      { label: '转正管理', value: '36', unit: '人', note: '本月 · 待评议 9 人', color: '#4389ed' },
      { label: '调动管理', value: '21', unit: '人', note: '本月 · 待审批 3 人', cls: 'warn', color: '#e5a22a' },
      { label: '离职管理', value: '14', unit: '人', note: '本月 · 待交接 2 人', cls: 'danger', color: '#eb6262' }
    ],
    tabs: [
      {
        key: 'flow', label: '异动办理', title: '入转调离办理清单',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.unit)} · ${H.esc(r.dept)}</div></div>`, width: '190px' },
          { label: '类型', key: 'type', chip: true, width: '80px' },
          { label: '办理事项', render: (r) => `<span class="sub">${H.esc(r.content)}</span>`, width: '300px' },
          { label: '生效 / 申请日期', key: 'date', width: '120px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '说明', render: (r) => `<span class="sub">${H.esc(r.note)}</span>`, width: '180px' }
        ],
        rows: D2.TRANSFERS, searchKeys: ['name', 'id', 'unit', 'dept'],
        filter: { key: 'type', options: ['入职', '转正', '调动', '离职'], label: '全部类型' }
      },
      {
        key: 'remind', label: '30 天提醒', title: '近期即将变动人员（提前 30 天提醒）',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '100px' },
          { label: '单位 / 部门', render: (r) => `${r.unit} · ${r.dept}`, width: '190px' },
          { label: '变更事项', key: 'content', width: '300px' },
          { label: '日期', key: 'date', width: '120px' },
          { label: '剩余时间', render: (r) => `<span class="chip orange">${r.note}</span>`, width: '150px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '100px' }
        ],
        rows: D2.TRANSFERS.slice(0, 6), searchKeys: ['name', 'unit'], readonly: true
      }
    ],
    meta: { entity: '异动单', labels: { id: '单号', name: '员工', unit: '单位', dept: '部门', type: '类型', content: '办理事项', date: '日期', status: '状态', note: '说明' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '异动类型', type: 'select', options: ['入职', '转正', '调动', '离职'], required: true },
      { key: 'unit', label: '所属单位', type: 'select', options: D2.ORG_UNITS.map((u) => u.name) }, { key: 'dept', label: '部门' },
      { key: 'content', label: '办理事项', full: true }, { key: 'date', label: '生效日期', type: 'date' }, { key: 'note', label: '说明', full: true }
    ] }
  });

  window.HR_SPEC_ADD({
    key: 'transfer-duty', title: '职务变动',
    desc: '职务晋升、降级、免职的审批与生效日期管理；法定退休、特殊工种提前退休、返聘的申报与办理，全程留痕。',
    metrics: [
      { label: '晋升', value: '12', unit: '人', note: '2026 年累计', cls: 'up', color: '#7659e7' },
      { label: '降级 / 免职', value: '6', unit: '人', note: '含机构调整 3 人', color: '#4389ed' },
      { label: '退休办理', value: '8', unit: '人', note: '特殊工种 2 人', cls: 'warn', color: '#e5a22a' },
      { label: '返聘', value: '4', unit: '人', note: '技术专家 3 人', color: '#1cad9b' }
    ],
    tabs: [
      {
        key: 'promote', label: '晋升降级', title: '晋升 / 降级 / 免职审批',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.unit)}</div></div>`, width: '170px' },
          { label: '类型', key: 'type', chip: true, width: '80px' },
          { label: '原职务', key: 'from', width: '150px' },
          { label: '新职务', key: 'to', width: '180px' },
          { label: '生效日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '说明', render: (r) => `<span class="sub">${H.esc(r.note)}</span>`, width: '170px' }
        ],
        rows: D2.DUTY_CHANGES.filter((d) => d.type !== '退休'), searchKeys: ['name', 'id', 'from', 'to'],
        filter: { key: 'type', options: ['晋升', '降级', '免职'], label: '全部类型' }
      },
      {
        key: 'retire', label: '退休管理', title: '退休 / 返聘办理',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '100px' },
          { label: '单位', key: 'unit', width: '110px' },
          { label: '原职务', key: 'from', width: '150px' },
          { label: '办理结果', key: 'to', width: '140px' },
          { label: '生效日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
          { label: '说明', render: (r) => `<span class="sub">${H.esc(r.note)}</span>` }
        ],
        rows: D2.DUTY_CHANGES.filter((d) => d.type === '退休'), searchKeys: ['name', 'unit'], readonly: true
      }
    ],
    meta: { entity: '职务变动单', labels: { id: '单号', name: '员工', unit: '单位', type: '类型', from: '原职务', to: '新职务', date: '生效日期', status: '状态', note: '说明' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '变动类型', type: 'select', options: ['晋升', '降级', '免职'] },
      { key: 'from', label: '原职务' }, { key: 'to', label: '新职务' }, { key: 'date', label: '生效日期', type: 'date' }, { key: 'note', label: '说明', full: true }
    ] }
  });

  /* ===== 工龄 ===== */
  window.HR_SPEC_ADD({
    key: 'seniority-calc', title: '工龄计算',
    notice: '本期暂未上线：根据 2026-10-30 汇报会纪要，工龄与司龄功能纳入后续迭代，本页为规划演示。',
    desc: '分别计算连续工龄、本企业工龄（司龄）、社会工龄；依据入职日期、调动记录自动生成工龄，支持手工修正并保留调整理由。',
    metrics: [
      { label: '平均司龄', value: '12.4', unit: '年', note: '较上年 +0.3 年', cls: 'up', color: '#7659e7' },
      { label: '平均工龄', value: '15.8', unit: '年', note: '含视同缴费年限', color: '#4389ed' },
      { label: '本月工龄调整', value: '6', unit: '人', note: '学历 / 军龄认定', color: '#1cad9b' },
      { label: '待手工修正', value: '3', unit: '人', note: '调动记录待补全', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'types', label: '工龄类型', title: '员工工龄台账（连续工龄 / 司龄 / 社会工龄）',
        columns: [
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)}</div></div>`, width: '150px' },
          { label: '单位', key: 'unit', width: '100px' },
          { label: '入职日期', key: 'hireDate', width: '110px' },
          { label: '连续工龄', key: 'continuous', width: '96px', align: 'right' },
          { label: '本企业（司龄）', key: 'company', width: '120px', align: 'right' },
          { label: '社会工龄', key: 'social', width: '96px', align: 'right' },
          { label: '认定状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.SENIORITY, searchKeys: ['name', 'empNo', 'unit'], readonly: true
      },
      {
        key: 'auto', label: '自动计算', title: '自动计算规则与结果',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '110px' },
          { label: '计算口径', render: (r) => `<span class="sub">入职 ${r.hireDate} · 调动记录 2 条</span>`, width: '230px' },
          { label: '连续工龄', key: 'continuous', width: '90px', align: 'right' },
          { label: '司龄', key: 'company', width: '80px', align: 'right' },
          { label: '社会工龄', key: 'social', width: '90px', align: 'right' },
          { label: '手工修正', render: () => `<span class="sub">未修正</span>`, width: '100px' },
          { label: '计算时间', render: () => '2026-10-29 02:00', width: '150px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '90px' }
        ],
        rows: D2.SENIORITY, searchKeys: ['name'], readonly: true
      }
    ],
    extra: () => H.panel('工龄计算口径', `<div class="formula">连续工龄 = 当前日期 − 首次参加工作日期（含军龄 / 视同缴费年限）<br>本企业工龄（司龄） = 当前日期 − 最近一次进入集团日期（含内部调动，不含离职再入职间隔）<br>社会工龄 = 连续工龄 − 本企业工龄 + 外部缴费年限；每月 1 日 02:00 自动重算，手工修正须附证明材料并留痕。</div>`, '系统自动 · 每日校验')
  });

  window.HR_SPEC_ADD({
    key: 'seniority-verify', title: '工龄认定',
    notice: '本期暂未上线：工龄认定规则随工龄模块纳入后续迭代，本页为规划演示。',
    desc: '军龄、上山下乡、原单位年限的视同工龄认定；有毒有害、高温、高空、井下作业工龄折算与提前退休条件判断。',
    metrics: [
      { label: '待认定', value: '3', unit: '人', note: '材料待补充 2 人', cls: 'warn', color: '#e5a22a' },
      { label: '本月认定', value: '8', unit: '人', note: '军龄 3 · 原单位 3 · 上山下乡 2', color: '#7659e7' },
      { label: '视同缴费年限', value: '96', unit: '年', note: '累计认定', color: '#4389ed' },
      { label: '特殊工种', value: '18', unit: '人', note: '符合提前退休 6 人', cls: 'up', color: '#1cad9b' }
    ],
    tabs: [
      {
        key: 'deem', label: '视同缴费年限', title: '视同缴费年限认定',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)}</div></div>`, width: '140px' },
          { label: '认定类型', key: 'type', chip: true, width: '110px' },
          { label: '认定年限', key: 'years', width: '90px', align: 'right' },
          { label: '证明材料', render: (r) => `<span class="sub">${H.esc(r.evidence)}</span>`, width: '250px' },
          { label: '认定日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.SENIORITY_VERIFY, searchKeys: ['name', 'id', 'type'],
        filter: { key: 'type', options: ['军龄', '上山下乡', '原单位年限'], label: '全部类型' }
      },
      {
        key: 'special', label: '特殊工种工龄', title: '特殊工种工龄折算与提前退休判断',
        columns: [
          { label: '员工', key: 'name', bold: true, width: '100px' },
          { label: '岗位', key: 'post', width: '130px' },
          { label: '工种类型', key: 'type', chip: true, width: '100px' },
          { label: '实际年限', key: 'years', width: '90px', align: 'right' },
          { label: '折算系数', key: 'factor', width: '90px', align: 'right' },
          { label: '折算结果', key: 'result', width: '120px' },
          { label: '提前退休条件', key: 'retire', width: '120px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '90px' }
        ],
        rows: D2.SPECIAL_WORK, searchKeys: ['name', 'post'],
        filter: { key: 'type', options: ['有毒有害', '高温', '高空', '井下'], label: '全部工种' }, readonly: true
      }
    ],
    extra: () => H.panel('认定材料要求', `<div class="dot-list">
      <div class="dot-item"><i></i>军龄：退伍证、入伍登记表、服役期间工资档案</div>
      <div class="dot-item"><i></i>上山下乡：知青办证明、户籍迁移记录、原单位档案</div>
      <div class="dot-item"><i></i>原单位年限：原单位劳动合同、社保缴费记录、离职证明</div>
      <div class="dot-item"><i></i>特殊工种：岗位登记表、历年工资表、劳动保护用品发放记录（满 8 年方可认定折算）</div>
    </div>`, '人社部门审核口径')
  });

  window.HR_SPEC_ADD({
    key: 'seniority-apply', title: '工龄应用',
    notice: '本期暂未上线：工龄待遇联动随工龄模块纳入后续迭代，本页为规划演示。',
    desc: '工龄工资标准、年休假天数、退休待遇、荣誉表彰资格的自动引用；规则一处配置，全集团执行。',
    metrics: [
      { label: '工龄工资总额', value: '620', unit: '万元/年', note: '按 20 元/年·人测算', color: '#7659e7' },
      { label: '年休假达标', value: '2,412', unit: '人', note: '10 年以上 1,986 人', color: '#4389ed' },
      { label: '荣誉表彰资格', value: '486', unit: '人', note: '工龄满 20 年', cls: 'up', color: '#1cad9b' },
      { label: '退休待遇测算', value: '8', unit: '人', note: '本年度办理', color: '#e5a22a' }
    ],
    columns: [
      { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)}</div></div>`, width: '150px' },
      { label: '工龄', key: 'years', width: '70px', align: 'right' },
      { label: '工龄工资', render: (r) => `<span class="num">${r.wage} 元/月</span>`, width: '110px', align: 'right' },
      { label: '年休假', render: (r) => `${r.annualLeave} 天`, width: '90px', align: 'right' },
      { label: '退休待遇', key: 'retire', width: '110px' },
      { label: '荣誉表彰资格', key: 'honor', width: '150px' },
      { label: '引用状态', render: () => H.statusTag('已引用'), width: '96px' }
    ],
    rows: D2.SENIORITY_APPLY, searchKeys: ['name', 'empNo'],
    extra: () => H.panel('工龄联动规则', `<div class="formula">工龄工资 = 工龄 × 20 元/月（满 20 年封顶 400 元）<br>年休假 = 工龄 1–10 年 5 天 / 10–20 年 10 天 / 20 年以上 15 天<br>荣誉表彰：工龄满 20 年可参评集团劳动模范、先进工作者；退休待遇按连续工龄核定。</div>`, '自动引用 · 无需重复录入')
  });

  /* ===== 合同 ===== */
  window.HR_SPEC_ADD({
    key: 'contract-manage', title: '合同管理',
    notice: '本期暂未上线：根据汇报会纪要，劳动合同功能纳入后续迭代，本页为规划演示。',
    desc: '固定期限、无固定期限合同的签订、续签与到期预警；合同变更、解除、终止的审批流程与经济补偿测算。',
    metrics: [
      { label: '在册合同', value: '2,846', unit: '份', note: '签订率 100%', cls: 'up', color: '#7659e7' },
      { label: '30 天内到期', value: '24', unit: '份', note: '需发起续签', cls: 'warn', color: '#e5a22a' },
      { label: '本月续签', value: '18', unit: '份', note: '无固定期限 6 份', color: '#4389ed' },
      { label: '变更 / 解除', value: '9', unit: '份', note: '含协商解除 2 份', color: '#eb6262' }
    ],
    tabs: [
      {
        key: 'sign', label: '合同签订续签', title: '劳动合同台账（含到期预警）',
        columns: [
          { label: '合同编号', key: 'id', width: '120px' },
          { label: '员工', render: (r) => `<div><div class="strong">${H.esc(r.name)}</div><div class="sub">${H.esc(r.empNo)} · ${H.esc(r.unit)}</div></div>`, width: '180px' },
          { label: '合同类型', key: 'type', chip: true, width: '120px' },
          { label: '起始日期', key: 'start', width: '104px' },
          { label: '到期日期', key: 'end', width: '104px' },
          { label: '剩余天数', render: (r) => `<span class="${r.days <= 30 ? 'status-tag orange' : 'sub'}"><i></i>${r.days} 天</span>`, width: '100px' },
          { label: '签订次数', key: 'renew', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.CONTRACTS, searchKeys: ['name', 'id', 'unit'],
        filter: { key: 'status', options: ['履行中', '待续签', '已到期'], label: '全部状态' }
      },
      {
        key: 'change', label: '合同变更解除', title: '合同变更 / 解除 / 终止审批',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '员工', key: 'name', bold: true, width: '90px' },
          { label: '类型', key: 'type', chip: true, width: '80px' },
          { label: '变更内容', render: (r) => `<span class="sub">${H.esc(r.content)}</span>`, width: '330px' },
          { label: '申请日期', key: 'date', width: '110px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.CONTRACT_CHANGES, searchKeys: ['name', 'id'],
        filter: { key: 'type', options: ['续签', '变更', '解除', '终止'], label: '全部类型' }
      }
    ],
    meta: { entity: '合同', labels: { id: '合同编号', name: '员工', empNo: '工号', unit: '单位', type: '合同类型', start: '起始日期', end: '到期日期', days: '剩余天数', renew: '签订次数', status: '状态' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '合同类型', type: 'select', options: ['固定期限', '无固定期限', '劳务派遣协议'] },
      { key: 'start', label: '起始日期', type: 'date' }, { key: 'end', label: '到期日期', type: 'date' }
    ] },
    extra: () => H.panel('经济补偿测算', `<div class="formula">经济补偿 = 工作年限 × 解除前 12 个月平均工资（N）；未提前 30 天通知另加 1 个月代通知金（N+1）。<br>例：周鹏 司龄 13.4 年、月均工资 8,200 元 → 协商解除补偿 13.4 × 8,200 ≈ 109,880 元。</div>`, '系统自动测算')
  });

  window.HR_SPEC_ADD({
    key: 'contract-agreement', title: '协议管理',
    notice: '本期暂未上线：协议管理随劳动合同模块纳入后续迭代，电子网签作为后续方向。',
    desc: '保密协议、竞业限制协议、培训服务期协议的签订、履约跟踪与到期提醒，与劳动合同、岗位、薪酬联动。',
    metrics: [
      { label: '有效协议', value: '286', unit: '份', note: '保密 168 · 竞业 62 · 服务期 56', color: '#7659e7' },
      { label: '30 天内到期', value: '9', unit: '份', note: '需评估续签', cls: 'warn', color: '#e5a22a' },
      { label: '竞业限制补偿', value: '62', unit: '人', note: '月补偿 30% 工资', color: '#4389ed' },
      { label: '服务期违约', value: '2', unit: '起', note: '违约金已核定', cls: 'danger', color: '#eb6262' }
    ],
    columns: [
      { label: '协议编号', key: 'id', width: '120px' },
      { label: '员工', key: 'name', bold: true, width: '100px' },
      { label: '协议类型', key: 'type', chip: true, width: '150px' },
      { label: '签订日期', key: 'sign', width: '110px' },
      { label: '到期日期', key: 'end', width: '110px' },
      { label: '履约状态', render: (r) => H.statusTag(r.status), width: '100px' },
      { label: '约定内容', render: (r) => `<span class="sub">${r.type === '竞业限制协议' ? '离职后 2 年内不得从事同类业务，按月支付补偿' : r.type === '培训服务期协议' ? '服务期 5 年，违约按未履行年限折算' : '保密期限至协议终止后 3 年'}</span>`, width: '300px' }
    ],
    rows: D2.AGREEMENTS, searchKeys: ['name', 'id'],
    filter: { key: 'type', options: ['保密协议', '竞业限制协议', '培训服务期协议'], label: '全部协议类型' },
    meta: { entity: '协议', labels: { id: '协议编号', name: '员工', type: '协议类型', sign: '签订日期', end: '到期日期', status: '履约状态' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '协议类型', type: 'select', options: ['保密协议', '竞业限制协议', '培训服务期协议'] },
      { key: 'sign', label: '签订日期', type: 'date' }, { key: 'end', label: '到期日期', type: 'date' }
    ] }
  });

  window.HR_SPEC_ADD({
    key: 'contract-dispute', title: '劳动争议',
    notice: '本期暂未上线：劳动争议处理随劳动合同模块纳入后续迭代，本页为规划演示。',
    desc: '劳动争议登记、调解、仲裁、诉讼的过程记录与归档，全过程留痕并关联合同、薪酬、考勤证据。',
    metrics: [
      { label: '在办争议', value: '3', unit: '起', note: '调解 1 · 仲裁 1 · 诉讼 1', cls: 'warn', color: '#e5a22a' },
      { label: '已办结', value: '3', unit: '起', note: '和解 2 · 裁决 1', cls: 'up', color: '#1cad9b' },
      { label: '平均处理周期', value: '38', unit: '天', note: '较上年缩短 9 天', color: '#4389ed' },
      { label: '补偿金额', value: '21.6', unit: '万元', note: '2026 年累计', color: '#eb6262' }
    ],
    columns: [
      { label: '案号', key: 'id', width: '120px' },
      { label: '员工', key: 'name', bold: true, width: '100px' },
      { label: '争议类型', key: 'type', width: '150px' },
      { label: '处理阶段', key: 'stage', chip: true, width: '100px' },
      { label: '登记日期', key: 'date', width: '110px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' },
      { label: '负责人', key: 'owner', width: '90px' }
    ],
    rows: D2.DISPUTES, searchKeys: ['name', 'id', 'type'],
    filter: { key: 'stage', options: ['协商', '调解', '仲裁', '诉讼'], label: '全部阶段' },
    meta: { entity: '争议案件', labels: { id: '案号', name: '员工', type: '争议类型', stage: '处理阶段', date: '登记日期', status: '状态', owner: '负责人' }, fields: [
      { key: 'name', label: '员工姓名', required: true }, { key: 'type', label: '争议类型' }, { key: 'stage', label: '处理阶段', type: 'select', options: ['协商', '调解', '仲裁', '诉讼'] }, { key: 'owner', label: '负责人' }
    ] }
  });

  /* ===== 招聘 ===== */
  window.HR_SPEC_ADD({
    key: 'recruit-demand', title: '招聘需求',
    desc: '年度用人计划编制、岗位需求申报与逐级审批；审批通过后一键生成招聘公告、岗位说明书、任职资格表与面试评分表，同步招聘网站与高校就业平台。',
    metrics: [
      { label: '需求单位', value: '7', unit: '家', note: '覆盖 6 家子公司 + 集团本部', color: '#7659e7' },
      { label: '招聘岗位', value: '8', unit: '个', note: '管理 / 技术 / 技能三类序列', color: '#4389ed' },
      { label: '计划招聘', value: '42', unit: '人', note: '含校园招聘 12 人', color: '#1cad9b' },
      { label: '已录用', value: '18', unit: '人', note: '完成率 42.9%', cls: 'up', color: '#e5a22a' }
    ],
    columns: [
      { label: '需求单号', key: 'id', width: '130px' },
      { label: '需求单位', key: 'company', width: '100px' },
      { label: '需求部门', key: 'department', width: '110px' },
      { label: '招聘岗位', key: 'position', bold: true, width: '120px' },
      { label: '人数', key: 'headcount', width: '60px', align: 'center' },
      { label: '学历', key: 'education', width: '100px' },
      { label: '证书 / 资格', render: (r) => `<span class="sub">${H.esc(r.certificate)}</span>`, width: '180px' },
      { label: '经历要求', render: (r) => `<span class="sub">${H.esc(r.experience)}</span>`, width: '200px' },
      { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
    ],
    rows: D2.DEMANDS, searchKeys: ['id', 'company', 'department', 'position'],
    filter: { key: 'status', options: ['待审批', '已审批', '招聘中', '已到岗 1 人'], label: '全部状态' },
    meta: { entity: '招聘需求', labels: { id: '需求单号', company: '需求单位', department: '需求部门', position: '招聘岗位', headcount: '招聘人数', education: '学历要求', certificate: '证书 / 资格要求', experience: '工作经历要求', status: '状态' }, fields: [
      { key: 'company', label: '需求单位', type: 'select', options: D2.ORG_UNITS.map((u) => u.name), required: true },
      { key: 'department', label: '需求部门', required: true },
      { key: 'position', label: '招聘岗位', required: true },
      { key: 'headcount', label: '招聘人数' },
      { key: 'education', label: '学历要求', type: 'select', options: ['中专及以上', '大专及以上', '本科及以上', '硕士及以上'] },
      { key: 'certificate', label: '证书 / 资格要求', full: true },
      { key: 'experience', label: '工作经历要求', full: true }
    ] },
    extra: () => H.panel('招聘需求单 → 招聘表单（自动生成）', `
      <div class="auto-form" style="display:flex;flex-wrap:wrap;gap:8px 22px;color:#696d7b;font-size:14px">
        <strong>需求单号 ZLZP-2026-042</strong><span>三叶实业 · 生产运行部 · 化工总控工</span><b style="color:#6d52db">12 人</b>
        <span>用工性质 正式工</span><span>薪资 6,500–9,000 元</span><span>工作地点 兰州西固</span></div>
      <p class="note-line">学历 大专及以上 · 证书 化工总控工（中级） · 经历 3 年以上石化装置操作 · 招聘渠道 校园招聘 + 社会招聘 + 集团招聘网站</p>
      <div class="doc-grid" style="margin-top:14px">${['招聘公告', '岗位说明书', '任职资格表', '面试评分表'].map((x, i) => `<div class="doc-item"><div class="doc-icon">${H.svg('file')}</div><div class="doc-body"><div class="doc-name">0${i + 1}　${x}<span class="chip purple">自动生成</span></div><div class="doc-sub">审批通过后可下载 / 发布</div></div></div>`).join('')}</div>
      <p class="panel-note">审批通过后同步至招聘网站与高校就业平台，简历自动回流人才库；一键生成并发布。</p>`, '已审批 5 项')
  });

  window.HR_SPEC_ADD({
    key: 'recruit-execute', title: '招聘执行',
    desc: '招聘渠道管理、简历库与人才库标签检索；笔试、面试、心理测评、背景调查、体检的组织与评价记录；拟录用人员审批、offer 发放与入职前准备。',
    metrics: [
      { label: '在办岗位', value: '8', unit: '个', note: '覆盖 7 家单位', color: '#7659e7' },
      { label: '本月简历', value: '286', unit: '份', note: '通过初筛 46 人', color: '#4389ed' },
      { label: '在办测评', value: '12', unit: '人', note: '笔试 / 面试 / 背调 / 体检', color: '#1cad9b' },
      { label: '拟录用', value: '5', unit: '人', note: '公示中 2 人', cls: 'warn', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'resume', label: '渠道与简历', title: '渠道与简历（BOSS直聘 / 智联招聘 / 前程无忧）',
        columns: [
          { label: '渠道', key: 'channel', chip: true, width: '110px' },
          { label: '候选人', key: 'name', bold: true, width: '90px' },
          { label: '联系电话', key: 'phone', width: '120px' },
          { label: '应聘岗位', key: 'position', width: '130px' },
          { label: '学历 / 院校', render: (r) => `<span class="sub">${H.esc(r.education)}</span>`, width: '230px' },
          { label: '工作年限', key: 'years', width: '80px', align: 'right' },
          { label: '简历评分', render: (r) => `<span class="score" style="color:#6750d8;font-weight:700">${r.score}</span>`, width: '80px', align: 'center' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.CANDIDATES, searchKeys: ['name', 'position', 'channel'],
        filter: { key: 'status', options: ['待初筛', '已初筛', '待面试'], label: '全部状态' }
      },
      {
        key: 'eval', label: '甄选测评', title: '甄选测评（笔试 · 面试 · 背调 · 体检）',
        columns: [
          { label: '候选人', key: 'name', bold: true, width: '90px' },
          { label: '测评类型', key: 'type', chip: true, width: '90px' },
          { label: '安排与结果', render: (r) => `<span class="sub">${H.esc(r.detail)}</span>`, width: '280px' },
          { label: '结果', key: 'result', width: '110px' },
          { label: '日期', key: 'date', width: '100px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.EVALUATIONS, searchKeys: ['name', 'type'],
        filter: { key: 'type', options: ['笔试', '面试', '背景调查', '体检'], label: '全部测评' }, readonly: true
      },
      {
        key: 'offer', label: '录用审批', title: '拟录用人员公示与录用审批',
        columns: [
          { label: '候选人', key: 'name', bold: true, width: '90px' },
          { label: '拟录用岗位', key: 'position', width: '140px' },
          { label: '录用单位', key: 'unit', width: '110px' },
          { label: '公示期', key: 'period', width: '140px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '100px' },
          { label: '后续动作', render: (r) => (r.status === '已通过' ? '<span class="chip green">推送入职办理</span>' : '<span class="chip orange">公示中</span>'), width: '140px' }
        ],
        rows: D2.OFFERS, searchKeys: ['name', 'position', 'unit'],
        filter: { key: 'status', options: ['待审批', '待公示', '公示中', '已通过'], label: '全部状态' }, readonly: true
      }
    ],
    extra: () => H.panel('招聘执行规则', `<div class="dot-list">
      <div class="dot-item"><i></i>简历经解析自动生成人才标签并与岗位匹配打分，重复投递自动去重，可按岗位批量下载、转发用人部门。</div>
      <div class="dot-item"><i></i>笔试、面试、背调、体检四项可并行或串行配置，任一环节不通过自动终止流程并通知候选人。</div>
      <div class="dot-item"><i></i>公示期 7 天，无异议后自动生成录用通知并推送入职办理，异议自动转纪检复核。</div>
    </div>`, '渠道 → 测评 → 录用 三段贯通')
  });

  window.HR_SPEC_ADD({
    key: 'recruit-type', title: '招聘类型',
    desc: '按校园招聘平台、系统内部公开招聘平台、社会化招聘平台三类平台统一管理，支持校招 / 社招 / 猎头 / 内部竞聘分类统计；应届高校毕业生转正定级单独线上办理。',
    metrics: [
      { label: '招聘平台', value: '3', unit: '类', note: '校园 / 内部公开 / 社会化', color: '#7659e7' },
      { label: '计划招聘', value: '59', unit: '人', note: '2026 年四季度', color: '#4389ed' },
      { label: '已完成', value: '28', unit: '人', note: '完成率 47.5%', cls: 'up', color: '#1cad9b' },
      { label: '应届生定级', value: '7', unit: '人', note: '线上考核 / 答辩 / 公示', color: '#e5a22a' }
    ],
    tabs: [
      {
        key: 'platform', label: '招聘平台', title: '三类招聘平台与分类统计',
        columns: [
          { label: '招聘类型', key: 'type', bold: true, width: '180px' },
          { label: '计划人数', key: 'plan', width: '100px' },
          { label: '完成进度', key: 'progress', width: '150px' },
          { label: '渠道 / 来源', render: (r) => `<span class="sub">${H.esc(r.channel)}</span>`, width: '300px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '96px' }
        ],
        rows: D2.RECRUIT_TYPES, searchKeys: ['type', 'channel'],
        filter: { key: 'status', options: ['进行中', '待启动'], label: '全部状态' }
      },
      {
        key: 'graduate', label: '应届生转正定级', title: '应届高校毕业生转正定级（线上考核 · 答辩 · 公示 · 电子证明）',
        columns: [
          { label: '单号', key: 'id', width: '120px' },
          { label: '学生', key: 'name', bold: true, width: '90px' },
          { label: '院校 / 专业', render: (r) => `<div>${H.esc(r.school)}</div><div class="sub">${H.esc(r.major)}</div>`, width: '210px' },
          { label: '定级岗位', render: (r) => `<span class="sub">${H.esc(r.post)}</span>`, width: '200px' },
          { label: '当前环节', key: 'stage', render: (r) => H.chip(r.stage, 'blue'), width: '110px' },
          { label: '专家评分', key: 'score', width: '80px', align: 'center' },
          { label: '结果公示', key: 'publish', width: '130px' },
          { label: '电子证明', render: (r) => H.statusTag(r.proof === '已发放' ? '已发放' : '待生成'), width: '100px' },
          { label: '状态', render: (r) => H.statusTag(r.status), width: '90px' }
        ],
        rows: D2.GRADUATE_DEFENSE, searchKeys: ['name', 'school', 'major', 'post'],
        filter: { key: 'status', options: ['进行中', '公示中', '已完成'], label: '全部状态' }, readonly: true
      }
    ],
    meta: { entity: '招聘项目', labels: { type: '招聘类型', plan: '计划人数', progress: '完成进度', channel: '渠道 / 来源', status: '状态' }, fields: [
      { key: 'type', label: '招聘类型', type: 'select', options: ['校园招聘平台', '内部公开招聘平台', '社会化招聘平台', '猎头寻访', '退役军人安置', '劳务协作'], required: true },
      { key: 'plan', label: '计划人数' }, { key: 'channel', label: '渠道 / 来源' }
    ] },
    extra: () => `<div class="two-columns">
      <section class="panel-card"><div class="panel-header"><h3>三类招聘平台</h3><span class="panel-extra">平台内统一办理</span></div>
        <div class="dot-list">
          <div class="dot-item"><i></i>校园招聘平台：启事发布、公示、中介协调、高校对接统一在平台内办理，简历自动回流人才库。</div>
          <div class="dot-item"><i></i>内部公开招聘平台：面向集团全体员工发布岗位，笔试、面试、录用全流程线上留痕。</div>
          <div class="dot-item"><i></i>社会化招聘平台：对接 BOSS直聘 / 智联 / 前程无忧接口自动抓取简历，支持猎头寻访与新材料人才引进。</div>
        </div></section>
      <section class="panel-card"><div class="panel-header"><h3>应届生转正定级流程</h3><span class="panel-extra">控制操作复杂度</span></div>
        <div class="flow-row">${[['学生上传材料'], ['专家评分'], ['答辩考核'], ['结果公示 7 天'], ['生成台账 / 电子证明']].map((x, i, a) => `<div class="flow-node ${i === 2 ? 'active' : ''}"><div class="flow-num">${i + 1}</div><div class="flow-body"><div class="flow-title">${x[0]}</div></div></div>${i < a.length - 1 ? '<div class="flow-arrow"></div>' : ''}`).join('')}</div>
        <p class="panel-note">全过程考核、答辩、结果公示线上流转，最终生成线上台账并发放电子证明。</p></section></div>`
  });
})();
