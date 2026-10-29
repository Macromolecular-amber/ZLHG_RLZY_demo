/* 员工信息管理演示 · 前端交互（无后端） */
(function () {
  const D = window.HR_DATA;
  const TODAY = new Date(2026, 9, 29); // 演示基准日期 2026-10-29
  const state = {
    page: 'basic',
    tab: { basic: 'profile', work: 'ledger', education: 'edu', certificate: 'special', archive: 'ledger' },
    filters: {},
    pageNo: {},
    pageSize: 10
  };

  /* ---------- 工具 ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const svg = (name, style) => `<svg class="ico"${style ? ` style="${style}"` : ''}><use href="#i-${name}"/></svg>`;

  function statusTag(text) {
    if (text == null || text === '' || text === '—') return '<span class="status-tag gray"><i></i>—</span>';
    let cls = 'gray';
    if (/逾期|离职|未通过|驳回|不合格/.test(text)) cls = 'red';
    else if (/待|即将|试用|借出|转递|借阅|补|预警/.test(text)) cls = 'orange';
    else if (/在库|有效|已归档|完整|已归还|已认证|在职|已办理|已通过/.test(text)) cls = 'green';
    return `<span class="status-tag ${cls}"><i></i>${esc(text)}</span>`;
  }

  function softChip(text, cls) {
    return `<span class="chip ${cls || 'gray'}">${esc(text)}</span>`;
  }

  function empTag(e) {
    const name = e.name || e.empName || '';
    const no = e.no || e.empNo || '';
    return `<div class="avatar-cell"><div class="avatar-sm${e.gender === '女' ? ' f' : ''}">${esc(String(name).slice(0, 1))}</div>`
      + `<div><div class="strong">${esc(name)}</div><div class="sub">${esc(no)}</div></div></div>`;
  }

  function maskId(v) {
    if (!v || v.length < 10) return v || '—';
    return v.slice(0, 6) + '********' + v.slice(-4);
  }

  function daysLeft(validTo) {
    if (!validTo || /长期/.test(validTo)) return null;
    const d = new Date(validTo + 'T00:00:00');
    return Math.round((d - TODAY) / 86400000);
  }

  function leftText(validTo) {
    const n = daysLeft(validTo);
    if (n == null) return '长期';
    if (n < 0) return `已逾期 ${Math.abs(n)} 天`;
    if (n === 0) return '今日到期';
    return `剩余 ${n} 天`;
  }

  function toast(msg, type) {
    const root = $('#toastRoot');
    const el = document.createElement('div');
    el.className = 'toast ' + (type || 'success');
    el.innerHTML = svg(type === 'warn' ? 'bell' : 'check') + `<span>${esc(msg)}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .25s'; setTimeout(() => el.remove(), 260); }, 2400);
  }

  function debounce(fn, wait) {
    let t;
    return function () { clearTimeout(t); t = setTimeout(fn, wait); };
  }

  /* ---------- 侧边栏 ---------- */
  function renderMenu() {
    $('#sidebarMenu').innerHTML = D.MENU.map((g) => {
      if (g.flat) {
        return `<li class="menu-group"><div class="menu-group-title" data-nav="home">${svg(g.icon)}<span class="menu-label">${esc(g.title)}</span></div></li>`;
      }
      const open = g.open && state.page !== 'home';
      const items = g.children.map((c, i) => {
        const key = g.key === 'employee' ? ['basic', 'work', 'education', 'certificate', 'archive'][i] : '';
        const active = key && key === state.page ? ' active' : '';
        return `<li class="menu-item${active}"${key ? ` data-page="${key}"` : ''}>${esc(c)}</li>`;
      }).join('');
      return `<li class="menu-group${open ? ' open' : ''}">
        <div class="menu-group-title" data-group-toggle="${g.key}">
          ${svg(g.icon)}
          <span class="menu-label">${esc(g.title)}</span>
          <svg class="ico menu-arrow"><use href="#i-chevron"/></svg>
        </div>
        <ul class="menu-children">${items}</ul>
      </li>`;
    }).join('');

    $$('#sidebarMenu .menu-group-title').forEach((el) => {
      el.addEventListener('click', () => {
        if (el.dataset.nav === 'home') { goPage('home'); return; }
        const group = D.MENU.find((m) => m.key === el.dataset.groupToggle);
        if (group && group.key !== 'employee') {
          toast('演示版仅开放「员工信息管理」模块，其余模块为框架占位', 'warn');
          return;
        }
        el.parentElement.classList.toggle('open');
      });
    });
    $$('#sidebarMenu .menu-item').forEach((el) => {
      el.addEventListener('click', () => { if (el.dataset.page) goPage(el.dataset.page); });
    });
  }

  function goPage(p) {
    state.page = p;
    try { history.replaceState(null, '', '#' + p); } catch (e) { /* 本地文件亦可 */ }
    renderMenu();
    renderPage();
  }

  /* ---------- 顶栏 ---------- */
  function initHeader() {
    $('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('collapse'));
    $('#notifyBell').addEventListener('click', () => toast('12 项待办：证件到期 7 · 合同到期 3 · 转正办理 2', 'warn'));
    $('#logoutBtn').addEventListener('click', () => toast('演示环境，退出操作未启用', 'warn'));
    const search = $('#globalSearch');
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && search.value.trim()) {
        const key = state.page + ':' + state.tab[state.page];
        state.filters[key] = Object.assign({}, state.filters[key], { q: search.value.trim() });
        state.pageNo[key] = 1;
        refreshTable();
        toast(`已按“${search.value.trim()}”筛选当前列表`, 'info');
      }
    });
  }

  /* ---------- 表头 / 筛选 ---------- */
  function heading(page) {
    const p = PAGES[page];
    return `<div class="page-heading">
      <div class="breadcrumb">员工信息管理<i>›</i><b>${esc(p.title)}</b></div>
      <div class="heading-main">
        <div>
          <h1>${esc(p.title)}</h1>
          <p>${p.desc}</p>
        </div>
        <div class="heading-action">${p.actions.map((a) => `<button class="btn${a.primary ? ' primary' : ''}" data-act="${a.act}">${a.icon ? svg(a.icon) : ''}${esc(a.label)}</button>`).join('')}</div>
      </div>
    </div>`;
  }

  function metrics(list) {
    return `<div class="metrics-grid">${list.map((m) => `<div class="metric-card">
      <span class="metric-label">${esc(m.label)}</span>
      <div class="metric-value">${m.value}${m.unit ? `<small>${esc(m.unit)}</small>` : ''}</div>
      <div class="metric-note ${m.cls || ''}">${esc(m.note)}</div>
      <i style="color:${m.color || '#7659e7'}"></i>
    </div>`).join('')}</div>`;
  }

  function fk(page, tab) { return page + ':' + tab; }
  function fval(key) {
    const f = state.filters[key] || {};
    return (k) => esc(f[k] || '');
  }

  function searchBox(key, ph) {
    return `<div class="input-icon-wrap"><svg class="ico"><use href="#i-search"/></svg>
      <input class="input filter-input" data-fk="${key}" data-filter="q" placeholder="${esc(ph)}" value="${fval(key)('q')}"></div>`;
  }

  function selectBox(key, field, options, allLabel) {
    const v = fval(key)(field);
    return `<select class="select filter-select" data-fk="${key}" data-filter="${field}">
      <option value="">${esc(allLabel || '全部')}</option>
      ${options.map((o) => `<option value="${esc(o)}"${v === esc(o) ? ' selected' : ''}>${esc(o)}</option>`).join('')}
    </select>`;
  }

  function filterBarHTML(filters, extra) {
    return `<div class="filter-bar">${filters || ''}<div class="filter-spacer"></div>${extra || ''}</div>`;
  }

  function exportBtn(page, tab) {
    return `<button class="btn" data-act="export" data-export="${page}:${tab}">${svg('download')}导出</button>`;
  }

  /* ---------- 表格 ---------- */
  function tableHTML(cols, rows) {
    if (!rows.length) {
      return `<div class="empty-state"><div class="box">${svg('folder')}</div>暂无符合条件的数据</div>`;
    }
    return `<div class="table-wrap"><table class="hr-table"><thead><tr>${cols.map((c) => `<th${c.width ? ` style="width:${c.width}"` : ''}${c.align ? ` class="align-${c.align}"` : ''}>${esc(c.label)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr>${cols.map((c) => `<td${c.align ? ` class="align-${c.align}"` : ''}>${c.render(r)}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div>`;
  }

  function pager(total, page, size) {
    const pages = Math.max(1, Math.ceil(total / size));
    let nums = '';
    for (let i = 1; i <= pages; i++) nums += `<button class="pager-btn${i === page ? ' active' : ''}" data-goto="${i}">${i}</button>`;
    return `<div class="pagination">
      <span>共 ${total} 条 · 每页 ${size} 条</span>
      <button class="pager-btn" data-goto="${Math.max(1, page - 1)}" ${page === 1 ? 'disabled' : ''}>上一页</button>
      ${nums}
      <button class="pager-btn" data-goto="${Math.min(pages, page + 1)}" ${page === pages ? 'disabled' : ''}>下一页</button>
    </div>`;
  }

  function tableBlock(page, tab) {
    const key = fk(page, tab);
    const cols = PAGES[page].columns[tab]();
    const rows = PAGES[page].rows(tab, state.filters[key] || {});
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / state.pageSize));
    const pageNo = Math.min(state.pageNo[key] || 1, pages);
    const start = (pageNo - 1) * state.pageSize;
    return { html: tableHTML(cols, rows.slice(start, start + state.pageSize)) + pager(total, pageNo, state.pageSize), total: total };
  }

  function refreshTable() {
    const page = state.page, tab = state.tab[page];
    const host = $('#tableHost');
    if (!host) return;
    const b = tableBlock(page, tab);
    host.innerHTML = b.html;
    const countEl = $('#panelCount');
    if (countEl) countEl.textContent = `共 ${b.total} 条`;
  }

  /* ---------- 页面定义 ---------- */
  const PAGES = {
    basic: {
      title: '基础信息',
      desc: '维护员工姓名、性别、出生日期、身份证、民族、政治面貌、籍贯、婚姻、联系方式与照片等基本信息；身份证、户口本、学历学位、职业资格证扫描件统一归档并自动有效期提醒。',
      actions: [
        { label: '新增员工档案', icon: 'plus', primary: true, act: 'add-employee' },
        { label: '批量导入', icon: 'upload', act: 'import' },
        { label: '导出', icon: 'download', act: 'export' }
      ],
      metrics: [
        { label: '在册员工', value: '2,846', unit: '人', note: '较上月 +2.1%', cls: 'up', color: '#7659e7' },
        { label: '本月新增', value: '36', unit: '人', note: '校园招聘 21 · 社招 15', color: '#4389ed' },
        { label: '证件待更新', value: '24', unit: '项', note: '30 天内到期 17 项', cls: 'warn', color: '#e5a22a' },
        { label: '照片缺失', value: '128', unit: '人', note: '待补采 4.5%', color: '#eb6262' }
      ],
      tabs: [
        { key: 'profile', label: '个人信息档案' },
        { key: 'docs', label: '证件信息' }
      ],
      columns: {
        profile: () => [
          { label: '工号', width: '92px', render: (e) => `<span class="num">${esc(e.no)}</span>` },
          { label: '姓名', width: '150px', render: (e) => empTag(e) },
          { label: '性别', width: '56px', render: (e) => esc(e.gender) },
          { label: '出生日期', width: '110px', render: (e) => `<span class="num">${esc(e.birth)}</span>` },
          { label: '身份证号', width: '180px', render: (e) => `<span class="num sub">${maskId(e.idcard)}</span>` },
          { label: '民族', width: '70px', render: (e) => esc(e.nation) },
          { label: '政治面貌', width: '100px', render: (e) => esc(e.politics) },
          { label: '籍贯', width: '96px', render: (e) => esc(e.native) },
          { label: '婚姻', width: '70px', render: (e) => esc(e.marriage) },
          { label: '手机号', width: '130px', render: (e) => `<span class="num">${esc(e.phone)}</span>` },
          { label: '在职状态', width: '92px', render: (e) => statusTag(e.status) },
          { label: '操作', width: '140px', render: (e) => `<div class="actions"><button class="link-btn" data-act="view-employee" data-id="${e.no}">查看</button><button class="link-btn" data-act="edit-employee" data-id="${e.no}">编辑</button><button class="link-btn muted" data-act="view-docs" data-id="${e.no}">证件</button></div>` }
        ],
        docs: () => [
          { label: '员工', width: '150px', render: (r) => empTag(r.emp) },
          { label: '证件名称', width: '210px', render: (r) => `<span class="strong">${esc(r.doc.name)}</span>` },
          { label: '有效期限', width: '120px', render: (r) => `<span class="num">${esc(r.doc.validTo)}</span>` },
          { label: '归档状态', width: '110px', render: (r) => statusTag(r.doc.status) },
          { label: '剩余期限', width: '120px', render: (r) => `<span class="sub">${esc(leftText(r.doc.validTo))}</span>` },
          { label: '归档文件', width: '230px', render: (r) => r.doc.files.map((f) => `<a class="link-btn" data-act="preview" data-id="${r.emp.no}">${esc(f)}</a>`).join(' ') },
          { label: '操作', width: '110px', render: (r) => `<div class="actions"><button class="link-btn" data-act="preview">预览</button><button class="link-btn muted" data-act="upload-doc" data-id="${r.emp.no}">补充</button></div>` }
        ]
      },
      rows: (tab, f) => {
        if (tab === 'profile') {
          return D.EMPLOYEES.filter((e) => (!f.q || [e.name, e.no, e.phone].some((v) => String(v).includes(f.q)))
            && (!f.unit || e.unit === f.unit) && (!f.status || e.status === f.status));
        }
        const list = [];
        D.EMPLOYEES.forEach((e) => e.docs.forEach((d) => list.push({ emp: e, doc: d })));
        return list.filter((r) => (!f.q || [r.emp.name, r.emp.no, r.doc.name].some((v) => String(v).includes(f.q)))
          && (!f.dtype || r.doc.name.indexOf(f.dtype) >= 0) && (!f.status || r.doc.status === f.status));
      },
      panel: (tab) => {
        if (tab === 'profile') {
          const k = fk('basic', 'profile');
          return {
            title: '员工基础信息台账', extra: exportBtn('basic', 'profile'),
            filters: () => searchBox(k, '搜索姓名、工号或手机号') + selectBox(k, 'unit', D.UNITS, '全部单位') + selectBox(k, 'status', ['在职', '试用期', '离职'], '全部状态')
          };
        }
        const k = fk('basic', 'docs');
        return {
          title: '证件归档与有效期提醒', extra: exportBtn('basic', 'docs'),
          filters: () => searchBox(k, '搜索姓名或证件名称') + selectBox(k, 'dtype', ['身份证', '户口本', '学历学位证书', '职业资格证', '特种作业', '注册资格'], '全部证件类型') + selectBox(k, 'status', ['已归档', '待补充', '即将到期', '已逾期'], '全部状态')
        };
      }
    },

    work: {
      title: '工作信息',
      desc: '覆盖员工编号、用工性质、所属单位、部门、岗位、直接上级，以及入职日期、试用期、转正日期、司龄工龄与在职状态的全生命周期维护。',
      actions: [
        { label: '新增用工登记', icon: 'plus', primary: true, act: 'add-work' },
        { label: '转正办理', act: 'regular' },
        { label: '导出', icon: 'download', act: 'export' }
      ],
      metrics: [
        { label: '在职员工', value: '2,846', unit: '人', note: '较上月 +2.1%', cls: 'up', color: '#7659e7' },
        { label: '试用期员工', value: '62', unit: '人', note: '本月到期 21 人', cls: 'warn', color: '#e5a22a' },
        { label: '本月转正', value: '21', unit: '人', note: '转正考核通过率 95%', cls: 'up', color: '#1cad9b' },
        { label: '待离职办理', value: '8', unit: '人', note: '含 3 人交接中', color: '#eb6262' }
      ],
      tabs: [{ key: 'ledger', label: '员工在职台账' }],
      columns: {
        ledger: () => [
          { label: '员工编号', width: '92px', render: (e) => `<span class="num">${esc(e.no)}</span>` },
          { label: '姓名', width: '150px', render: (e) => empTag(e) },
          { label: '用工性质', width: '96px', render: (e) => softChip(e.employment, e.employment === '正式工' ? 'blue' : e.employment === '劳务派遣' ? 'purple' : e.employment === '返聘' ? 'orange' : 'gray') },
          { label: '所属单位', width: '96px', render: (e) => esc(e.unit) },
          { label: '部门', width: '116px', render: (e) => esc(e.dept) },
          { label: '岗位', width: '110px', render: (e) => esc(e.position) },
          { label: '直接上级', width: '86px', render: (e) => esc(e.manager) },
          { label: '入职日期', width: '108px', render: (e) => `<span class="num">${esc(e.hireDate)}</span>` },
          { label: '试用期 / 转正', width: '128px', render: (e) => `<div>${esc(e.probation)}</div><div class="sub">${e.regularDate === '—' ? '待转正' : esc(e.regularDate)}</div>` },
          { label: '司龄 / 工龄', width: '108px', render: (e) => `<div class="num">${esc(e.seniority)}</div><div class="sub">工龄 ${esc(e.workAge)}</div>` },
          { label: '在职状态', width: '92px', render: (e) => statusTag(e.status) },
          { label: '操作', width: '120px', render: (e) => `<div class="actions"><button class="link-btn" data-act="view-work" data-id="${e.no}">查看</button><button class="link-btn" data-act="edit-work" data-id="${e.no}">编辑</button></div>` }
        ]
      },
      rows: (tab, f) => D.EMPLOYEES.filter((e) => (!f.q || [e.name, e.no, e.position].some((v) => String(v).includes(f.q)))
        && (!f.unit || e.unit === f.unit) && (!f.employment || e.employment === f.employment) && (!f.status || e.status === f.status)),
      panel: () => {
        const k = fk('work', 'ledger');
        return {
          title: '员工在职台账（用工属性 · 在职状态）', extra: exportBtn('work', 'ledger'),
          filters: () => searchBox(k, '搜索姓名、工号或岗位') + selectBox(k, 'unit', D.UNITS, '全部单位') + selectBox(k, 'employment', ['正式工', '劳务派遣', '返聘', '实习'], '全部用工性质') + selectBox(k, 'status', ['在职', '试用期', '离职'], '全部状态')
        };
      },
      extra: () => `<div class="two-columns">
        <section class="panel-card"><div class="panel-header"><h3>试用期与转正待办</h3><span class="panel-extra">2026 年 10 月</span></div>
          <div class="remind-list">${[
            { c: '#e5a22a', t: '马超 · 焊工（实习）试用期到期', s: '入职 2026-07-01 · 试用期 6 个月 · 拟 2026-12-31 转正考核', d: '剩 63 天' },
            { c: '#4389ed', t: '2026 年 10 月转正办理（3 人）', s: '刘婷、吴磊等 3 人转正考核材料待汇总', d: '10-31 截止' },
            { c: '#14a58b', t: '李静 · 劳动合同续签', s: '合同 2027-04-09 到期 · 建议提前 60 天启动', d: '剩 162 天' },
            { c: '#eb6262', t: '何欣 · 离职交接', s: '工作交接完成 80% · 资产归还待确认', d: '10-31 前' }
          ].map((r) => `<div class="remind-row"><span class="dot" style="background:${r.c}"></span><div class="r-main"><div class="r-title">${esc(r.t)}</div><div class="r-sub">${esc(r.s)}</div></div><span class="r-time">${esc(r.d)}</span></div>`).join('')}</div>
        </section>
        <section class="panel-card"><div class="panel-header"><h3>用工性质与在职状态分布</h3><span class="panel-extra">在职 2,846 人</span></div>
          <div class="remind-list">${[
            { n: '正式工', v: '2,468 人', p: 86.7, c: '#7055df' },
            { n: '劳务派遣', v: '262 人', p: 9.2, c: '#4389ed' },
            { n: '返聘 / 实习', v: '116 人', p: 4.1, c: '#1cad9b' }
          ].map((r) => `<div class="remind-row"><span class="dot" style="background:${r.c}"></span><div class="r-main"><div class="r-title">${r.n} · ${r.v}</div>
            <div style="margin-top:6px;height:6px;border-radius:3px;background:#f3f4f9;overflow:hidden"><span style="display:block;height:100%;width:${r.p}%;background:${r.c};border-radius:3px"></span></div></div>
            <span class="r-time">${r.p}%</span></div>`).join('')}</div>
          <p class="panel-note">在试用期 62 人、本月新入职 36 人；离职手续办理中 8 人，均已完成工作交接登记。</p>
        </section></div>`
    },

    education: {
      title: '学历与履历',
      desc: '维护全日制与在职学历、毕业院校、专业、学位、毕业时间及学信网认证；沉淀内部调动轨迹、外部工作经历、家庭成员与主要社会关系。',
      actions: [
        { label: '新增学历记录', icon: 'plus', primary: true, act: 'add-edu' },
        { label: '录入工作履历', act: 'add-resume' },
        { label: '导出', icon: 'download', act: 'export' }
      ],
      metrics: [
        { label: '本科及以上占比', value: '62.4', unit: '%', note: '较上年 +3.2%', cls: 'up', color: '#7659e7' },
        { label: '硕士及以上', value: '186', unit: '人', note: '含在职硕士 42 人', color: '#4389ed' },
        { label: '在职学历提升', value: '47', unit: '人', note: '在读 31 · 已毕业 16', color: '#1cad9b' },
        { label: '履历待补全', value: '15', unit: '人', note: '缺少外部经历证明', cls: 'warn', color: '#e5a22a' }
      ],
      tabs: [
        { key: 'edu', label: '学历学位' },
        { key: 'resume', label: '工作履历' },
        { key: 'family', label: '家庭成员' }
      ],
      columns: {
        edu: () => [
          { label: '员工', width: '150px', render: (r) => empTag(r.emp) },
          { label: '学历层次', width: '110px', render: (r) => softChip(r.row.level, /在职/.test(r.row.level) ? 'purple' : 'blue') },
          { label: '毕业院校', width: '170px', render: (r) => `<span class="strong">${esc(r.row.school)}</span>` },
          { label: '专业', width: '180px', render: (r) => esc(r.row.major) },
          { label: '学位', width: '96px', render: (r) => esc(r.row.degree) },
          { label: '毕业时间', width: '96px', render: (r) => `<span class="num">${esc(r.row.gradDate)}</span>` },
          { label: '学信网认证', width: '110px', render: (r) => statusTag(r.row.verify) },
          { label: '操作', width: '110px', render: (r) => `<div class="actions"><button class="link-btn" data-act="view-edu" data-id="${r.emp.no}">查看</button><button class="link-btn muted" data-act="edit-edu">编辑</button></div>` }
        ],
        resume: () => [
          { label: '员工', width: '150px', render: (r) => empTag(r.emp) },
          { label: '起止时间', width: '150px', render: (r) => `<span class="num">${esc(r.row.start)} — ${esc(r.row.end)}</span>` },
          { label: '工作单位', width: '210px', render: (r) => `<span class="strong">${esc(r.row.unit)}</span>` },
          { label: '部门', width: '110px', render: (r) => esc(r.row.dept) },
          { label: '岗位', width: '110px', render: (r) => esc(r.row.position) },
          { label: '类型', width: '96px', render: (r) => softChip(r.row.type, r.row.type === '内部调动' ? 'purple' : 'gray') },
          { label: '变动原因', width: '240px', render: (r) => `<span class="sub">${esc(r.row.reason)}</span>` },
          { label: '操作', width: '86px', render: (r) => `<button class="link-btn" data-act="view-resume" data-id="${r.emp.no}">查看</button>` }
        ],
        family: () => [
          { label: '员工', width: '150px', render: (r) => empTag(r.emp) },
          { label: '关系', width: '90px', render: (r) => softChip(r.row.relation, 'blue') },
          { label: '姓名', width: '110px', render: (r) => `<span class="strong">${esc(r.row.name)}</span>` },
          { label: '工作单位', width: '240px', render: (r) => esc(r.row.unit) },
          { label: '联系电话', width: '140px', render: (r) => `<span class="num">${esc(r.row.phone)}</span>` },
          { label: '操作', width: '100px', render: (r) => `<button class="link-btn" data-act="view-family" data-id="${r.emp.no}">查看</button>` }
        ]
      },
      rows: (tab, f) => {
        let list = [];
        if (tab === 'edu') D.EMPLOYEES.forEach((e) => e.education.forEach((row) => list.push({ emp: e, row })));
        if (tab === 'resume') D.EMPLOYEES.forEach((e) => e.resumes.forEach((row) => list.push({ emp: e, row })));
        if (tab === 'family') D.EMPLOYEES.forEach((e) => e.family.forEach((row) => list.push({ emp: e, row })));
        return list.filter((r) => (!f.q || [r.emp.name, r.emp.no, r.row.school, r.row.major, r.row.unit, r.row.position, r.row.name].some((v) => String(v || '').includes(f.q)))
          && (!f.level || r.row.level === f.level) && (!f.type || r.row.type === f.type) && (!f.relation || r.row.relation === f.relation));
      },
      panel: (tab) => {
        const k = fk('education', tab);
        const configs = {
          edu: { title: '学历学位档案', ph: '搜索姓名、院校或专业', extra: () => selectBox(k, 'level', ['全日制本科', '全日制大专', '全日制中专', '在职本科', '在职硕士'], '全部学历层次') },
          resume: { title: '工作履历（内部调动 + 外部经历）', ph: '搜索姓名、单位或岗位', extra: () => selectBox(k, 'type', ['内部调动', '外部经历'], '全部类型') },
          family: { title: '家庭成员与主要社会关系', ph: '搜索姓名或工作单位', extra: () => selectBox(k, 'relation', ['配偶', '父亲', '母亲', '子女'], '全部关系') }
        };
        const c = configs[tab];
        return { title: c.title, filters: () => searchBox(k, c.ph), extra: c.extra() + exportBtn('education', tab) };
      }
    },

    certificate: {
      title: '资质证照',
      desc: '登记电工、焊工、高处作业、危险化学品操作证等特种作业证书，以及注册安全工程师、特种设备作业人员证、化工总控工等注册类资格，自动到期预警与复审跟踪。',
      actions: [
        { label: '登记证书', icon: 'plus', primary: true, act: 'add-cert' },
        { label: '复审申报', act: 'renew-cert' },
        { label: '导出', icon: 'download', act: 'export' }
      ],
      metrics: [
        { label: '持证员工', value: '1,264', unit: '人', note: '占在职 44.4%', color: '#7659e7' },
        { label: '30 天内到期', value: '24', unit: '项', note: '已通知本人及部门', cls: 'warn', color: '#e5a22a' },
        { label: '复审逾期', value: '7', unit: '项', note: '已暂停上岗资格', cls: 'danger', color: '#eb6262' },
        { label: '注册类证书', value: '96', unit: '项', note: '注册安全工程师 38 人', color: '#4389ed' }
      ],
      tabs: [
        { key: 'special', label: '特种作业证' },
        { key: 'register', label: '注册资格' }
      ],
      columns: {
        special: () => certCols(),
        register: () => certCols()
      },
      rows: (tab, f) => D.CERTS.filter((c) => (tab === 'special' ? c.category === '特种作业' : c.category === '注册资格'))
        .filter((c) => (!f.q || [c.empName, c.empNo, c.name, c.no].some((v) => String(v).includes(f.q)))
          && (!f.status || c.review === f.status) && (!f.dept || c.dept === f.dept)),
      panel: (tab) => {
        const k = fk('certificate', tab);
        return {
          title: tab === 'special' ? '特种作业证书台账' : '注册类资格证书台账',
          filters: () => searchBox(k, '搜索姓名、证书名称或编号') + selectBox(k, 'dept', D.DEPTS, '全部部门'),
          extra: selectBox(k, 'status', ['有效', '待复审', '逾期'], '全部复审状态') + exportBtn('certificate', tab)
        };
      },
      extra: () => {
        const warn = D.CERTS.filter((c) => c.review !== '有效').sort((a, b) => (daysLeft(a.validTo) || 0) - (daysLeft(b.validTo) || 0));
        return `<section class="panel-card"><div class="panel-header"><h3>证书到期与复审预警</h3><span class="panel-extra">按剩余天数排序 · ${warn.length} 项</span></div>
          <div class="remind-list">${warn.map((c) => `<div class="remind-row"><span class="dot" style="background:${c.review === '逾期' ? '#eb6262' : '#e5a22a'}"></span>
            <div class="r-main"><div class="r-title">${esc(c.empName)} · ${esc(c.name)}</div><div class="r-sub">${esc(c.unit)} · ${esc(c.dept)} · 有效期至 ${esc(c.validTo)}</div></div>
            <span class="r-time">${esc(leftText(c.validTo))}</span></div>`).join('')}</div>
          <p class="panel-note">系统在到期前 90 / 30 / 7 天分三次推送提醒至员工、直接上级与安全环保部；逾期证书自动锁定上岗资格并触发复审流程。</p>
        </section>`;
      }
    },

    archive: {
      title: '人事档案',
      desc: '纸质人事档案扫描入库、目录索引维护、借阅与转递登记；档案状态（在库 / 借出 / 转递中）实时可查，全过程留痕。',
      actions: [
        { label: '新建档案', icon: 'plus', primary: true, act: 'add-archive' },
        { label: '扫描入库', icon: 'upload', act: 'scan' },
        { label: '导出', icon: 'download', act: 'export' }
      ],
      metrics: [
        { label: '档案总数', value: '2,846', unit: '册', note: '覆盖全部在册员工', color: '#7659e7' },
        { label: '已电子化', value: '2,713', unit: '册', note: '电子化率 95.3%', cls: 'up', color: '#1cad9b' },
        { label: '借阅中', value: '12', unit: '册', note: '超期未还 2 册', cls: 'warn', color: '#e5a22a' },
        { label: '待转递', value: '6', unit: '册', note: '离职 / 调动转递', color: '#4389ed' }
      ],
      tabs: [
        { key: 'ledger', label: '档案台账' },
        { key: 'borrow', label: '借阅与转递登记' }
      ],
      columns: {
        ledger: () => [
          { label: '档案编号', width: '128px', render: (a) => `<span class="num strong">${esc(a.no)}</span>` },
          { label: '员工', width: '150px', render: (a) => empTag(a) },
          { label: '单位 / 部门', width: '170px', render: (a) => `<div>${esc(a.unit)}</div><div class="sub">${esc(a.dept)}</div>` },
          { label: '档案状态', width: '96px', render: (a) => statusTag(a.status) },
          { label: '册数', width: '66px', render: (a) => `<span class="num">${esc(a.volumes)}</span>`, align: 'center' },
          { label: '入库日期', width: '108px', render: (a) => `<span class="num">${esc(a.inDate)}</span>` },
          { label: '目录索引', width: '96px', render: (a) => statusTag(a.index) },
          { label: '最近操作', width: '230px', render: (a) => `<span class="sub">${esc(a.lastOp)}</span>` },
          { label: '操作', width: '190px', render: (a) => `<div class="actions"><button class="link-btn" data-act="view-catalog" data-id="${a.no}">查看目录</button><button class="link-btn" data-act="borrow-archive" data-id="${a.no}">借阅</button><button class="link-btn muted" data-act="transfer-archive" data-id="${a.no}">转递</button></div>` }
        ],
        borrow: () => [
          { label: '登记单号', width: '120px', render: (b) => `<span class="num">${esc(b.id)}</span>` },
          { label: '档案编号', width: '128px', render: (b) => `<span class="num">${esc(b.archive)}</span>` },
          { label: '员工', width: '96px', render: (b) => `<span class="strong">${esc(b.name)}</span>` },
          { label: '业务类型', width: '90px', render: (b) => softChip(b.type, b.type === '借阅' ? 'blue' : 'purple') },
          { label: '事由', width: '230px', render: (b) => `<span class="sub">${esc(b.reason)}</span>` },
          { label: '经办人', width: '84px', render: (b) => esc(b.operator) },
          { label: '登记日期', width: '104px', render: (b) => `<span class="num">${esc(b.date)}</span>` },
          { label: '预计归还', width: '104px', render: (b) => `<span class="num">${esc(b.expect)}</span>` },
          { label: '状态', width: '96px', render: (b) => statusTag(b.status) },
          { label: '操作', width: '96px', render: (b) => (b.status === '已归还' ? '<button class="link-btn muted" data-act="borrow-detail">详情</button>' : `<button class="link-btn" data-act="return-archive" data-id="${b.id}">${b.type === '借阅' ? '归还' : '跟踪'}</button>`) }
        ]
      },
      rows: (tab, f) => {
        if (tab === 'ledger') {
          return D.ARCHIVES.filter((a) => (!f.q || [a.empName, a.empNo, a.no].some((v) => String(v).includes(f.q)))
            && (!f.status || a.status === f.status) && (!f.index || a.index === f.index));
        }
        return D.BORROWS.filter((b) => (!f.q || [b.name, b.archive, b.id, b.reason].some((v) => String(v).includes(f.q)))
          && (!f.type || b.type === f.type) && (!f.status || b.status === f.status));
      },
      panel: (tab) => {
        const k = fk('archive', tab);
        if (tab === 'ledger') {
          return {
            title: '人事档案台账（纸质 + 电子）', extra: exportBtn('archive', 'ledger'),
            filters: () => searchBox(k, '搜索姓名、工号或档案编号') + selectBox(k, 'status', ['在库', '借出', '待转递'], '全部档案状态') + selectBox(k, 'index', ['完整', '待补'], '全部目录状态')
          };
        }
        return {
          title: '借阅与转递登记', extra: exportBtn('archive', 'borrow'),
          filters: () => searchBox(k, '搜索姓名、档案编号或事由') + selectBox(k, 'type', ['借阅', '转递'], '全部业务类型') + selectBox(k, 'status', ['借阅中', '转递中', '已归还'], '全部状态')
        };
      }
    }
  };

  function certCols() {
    return [
      { label: '员工', width: '170px', render: (c) => `<div class="avatar-cell"><div class="avatar-sm">${esc(String(c.empName).slice(0, 1))}</div><div><div class="strong">${esc(c.empName)}</div><div class="sub">${esc(c.empNo)} · ${esc(c.unit)}</div></div></div>` },
      { label: '证书名称', width: '240px', render: (c) => `<span class="strong">${esc(c.name)}</span>` },
      { label: '证书编号 / 发证机关', width: '280px', render: (c) => `<div class="num">${esc(c.no)}</div><div class="sub">${esc(c.issuer)}</div>` },
      { label: '发证日期', width: '104px', render: (c) => `<span class="num">${esc(c.issueDate)}</span>` },
      { label: '有效期至 / 剩余', width: '126px', render: (c) => `<div class="num">${esc(c.validTo)}</div><div class="sub">${esc(leftText(c.validTo))}</div>` },
      { label: '复审状态', width: '96px', render: (c) => statusTag(c.review) },
      { label: '操作', width: '120px', render: (c) => `<div class="actions"><button class="link-btn" data-act="view-cert" data-id="${c.id}">查看</button><button class="link-btn muted" data-act="renew-cert" data-id="${c.id}">复审</button></div>` }
    ];
  }

  /* ---------- 渲染 ---------- */
  function tabsHTML(page) {
    const p = PAGES[page];
    if (!p.tabs || p.tabs.length < 2) return '';
    const cur = state.tab[page];
    return `<div class="tabs">${p.tabs.map((t) => {
      let count = D.EMPLOYEES.length;
      if (t.key === 'docs') count = D.EMPLOYEES.reduce((n, e) => n + e.docs.length, 0);
      else if (t.key === 'edu') count = D.EMPLOYEES.reduce((n, e) => n + e.education.length, 0);
      else if (t.key === 'resume') count = D.EMPLOYEES.reduce((n, e) => n + e.resumes.length, 0);
      else if (t.key === 'family') count = D.EMPLOYEES.reduce((n, e) => n + e.family.length, 0);
      else if (t.key === 'special') count = D.CERTS.filter((c) => c.category === '特种作业').length;
      else if (t.key === 'register') count = D.CERTS.filter((c) => c.category === '注册资格').length;
      else if (t.key === 'ledger' && page === 'archive') count = D.ARCHIVES.length;
      else if (t.key === 'borrow') count = D.BORROWS.length;
      return `<button class="tab-btn${t.key === cur ? ' active' : ''}" data-tab="${t.key}">${esc(t.label)}<span class="tab-count">${count}</span></button>`;
    }).join('')}</div>`;
  }

  function renderPage() {
    if (state.page === 'home') { showHome(); return; }
    const page = state.page;
    const p = PAGES[page];
    const tab = state.tab[page];
    const panel = p.panel(tab);
    const b = tableBlock(page, tab);
    $('#page').innerHTML = heading(page)
      + metrics(p.metrics)
      + `<section class="panel-card">
          <div class="panel-header"><h3>${esc(panel.title)}</h3><span class="panel-extra" id="panelCount">共 ${b.total} 条</span></div>
          ${tabsHTML(page)}
          ${filterBarHTML(panel.filters ? panel.filters() : '', panel.extra || '')}
        </section>
        <section class="panel-card" style="padding:16px 20px 18px"><div id="tableHost">${b.html}</div></section>`
      + (p.extra ? p.extra() : '');
  }

  /* ---------- 事件 ---------- */
  function bindPageEvents() {
    const page = $('#page');
    page.addEventListener('click', (e) => {
      const t = e.target.closest('[data-tab],[data-act],[data-goto]');
      if (!t) return;
      if (t.dataset.tab) {
        state.tab[state.page] = t.dataset.tab;
        state.pageNo[fk(state.page, t.dataset.tab)] = 1;
        renderPage();
        return;
      }
      if (t.dataset.goto) {
        state.pageNo[fk(state.page, state.tab[state.page])] = Number(t.dataset.goto);
        refreshTable();
        return;
      }
      if (t.dataset.act) handleAction(t.dataset.act, t.dataset.id);
    });
    page.addEventListener('input', (e) => {
      const el = e.target.closest('[data-filter]');
      if (!el || el.tagName === 'SELECT') return;
      const key = el.dataset.fk;
      state.filters[key] = Object.assign({}, state.filters[key], { [el.dataset.filter]: el.value });
      state.pageNo[key] = 1;
      refreshTable();
    });
    page.addEventListener('change', (e) => {
      const el = e.target.closest('select[data-filter]');
      if (!el) return;
      const key = el.dataset.fk;
      state.filters[key] = Object.assign({}, state.filters[key], { [el.dataset.filter]: el.value });
      state.pageNo[key] = 1;
      refreshTable();
    });
  }

  function handleAction(act, id) {
    switch (act) {
      case 'add-employee': return employeeForm(null);
      case 'edit-employee': return employeeForm(D.EMPLOYEES.find((x) => x.no === id));
      case 'view-employee': return employeeDrawer(D.EMPLOYEES.find((x) => x.no === id), 'basic');
      case 'view-docs': return docsDrawer(D.EMPLOYEES.find((x) => x.no === id));
      case 'view-work': return employeeDrawer(D.EMPLOYEES.find((x) => x.no === id), 'work');
      case 'edit-work': return workForm(D.EMPLOYEES.find((x) => x.no === id));
      case 'add-work': return workForm(null);
      case 'regular': return toast('已进入转正办理：本月待办理 3 人，转正考核材料已汇总', 'info');
      case 'add-edu': return eduForm(null);
      case 'add-resume': return resumeForm(null);
      case 'view-edu': return eduDrawer(D.EMPLOYEES.find((x) => x.no === id));
      case 'view-resume': return resumeDrawer(D.EMPLOYEES.find((x) => x.no === id));
      case 'view-family': return familyDrawer(D.EMPLOYEES.find((x) => x.no === id));
      case 'edit-edu': return toast('学历记录编辑：演示版可直接新增一条学历记录', 'info');
      case 'add-cert': return certForm();
      case 'renew-cert': return toast('复审申报已提交至安全环保部，待资质管理岗审核', 'success');
      case 'view-cert': return certDrawer(D.CERTS.find((c) => c.id === id));
      case 'add-archive': return toast('新建档案：请先在「扫描入库」中上传档案目录与扫描件', 'info');
      case 'scan': return toast('扫描入库队列：待处理 133 册，预计 2 个工作日完成电子化', 'info');
      case 'view-catalog': return catalogDrawer(D.ARCHIVES.find((a) => a.no === id));
      case 'borrow-archive': return borrowForm(D.ARCHIVES.find((a) => a.no === id), '借阅');
      case 'transfer-archive': return borrowForm(D.ARCHIVES.find((a) => a.no === id), '转递');
      case 'return-archive': return returnArchive(id);
      case 'borrow-detail': return toast('该登记单已完成归还，全过程留痕可在档案日志中查询', 'info');
      case 'preview': return toast('正在打开扫描件预览（演示环境不加载实际文件）', 'info');
      case 'upload-doc': return toast('已调用扫描仪接口，上传成功后自动更新目录索引', 'success');
      case 'import': return toast('批量导入模板已下载：员工基础信息导入模板.xlsx', 'success');
      case 'export': return doExport();
      default: return toast('演示环境：该操作仅做界面展示', 'warn');
    }
  }

  /* ---------- 导出 ---------- */
  function doExport() {
    const page = state.page;
    const tab = state.tab[page];
    const rows = PAGES[page].rows(tab, state.filters[fk(page, tab)] || {});
    let headers = [], lines = [];
    if (page === 'basic' && tab === 'profile') {
      headers = ['工号', '姓名', '性别', '出生日期', '身份证号', '民族', '政治面貌', '籍贯', '婚姻', '手机号', '所属单位', '部门', '岗位', '在职状态'];
      lines = rows.map((e) => [e.no, e.name, e.gender, e.birth, e.idcard, e.nation, e.politics, e.native, e.marriage, e.phone, e.unit, e.dept, e.position, e.status]);
    } else if (page === 'basic' && tab === 'docs') {
      headers = ['员工', '工号', '证件名称', '有效期限', '归档状态', '归档文件'];
      lines = rows.map((r) => [r.emp.name, r.emp.no, r.doc.name, r.doc.validTo, r.doc.status, r.doc.files.join('、')]);
    } else if (page === 'work') {
      headers = ['员工编号', '姓名', '用工性质', '所属单位', '部门', '岗位', '直接上级', '入职日期', '试用期', '转正日期', '司龄', '工龄', '状态'];
      lines = rows.map((e) => [e.no, e.name, e.employment, e.unit, e.dept, e.position, e.manager, e.hireDate, e.probation, e.regularDate, e.seniority, e.workAge, e.status]);
    } else if (page === 'certificate') {
      headers = ['员工', '单位', '部门', '证书名称', '证书编号', '发证机关', '发证日期', '有效期至', '复审状态'];
      lines = rows.map((c) => [c.empName, c.unit, c.dept, c.name, c.no, c.issuer, c.issueDate, c.validTo, c.review]);
    } else if (page === 'archive' && tab === 'ledger') {
      headers = ['档案编号', '员工', '单位', '部门', '状态', '册数', '入库日期', '目录索引'];
      lines = rows.map((a) => [a.no, a.empName, a.unit, a.dept, a.status, a.volumes, a.inDate, a.index]);
    } else if (page === 'archive') {
      headers = ['登记单号', '档案编号', '员工', '类型', '事由', '经办人', '登记日期', '状态'];
      lines = rows.map((b) => [b.id, b.archive, b.name, b.type, b.reason, b.operator, b.date, b.status]);
    } else {
      headers = ['员工', '内容'];
      lines = rows.map((r) => [r.emp.name, JSON.stringify(r.row)]);
    }
    const csv = '\ufeff' + [headers].concat(lines).map((r) => r.map((x) => `"${String(x == null ? '' : x).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `员工信息管理-${page}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`已导出 ${rows.length} 条记录（CSV）`, 'success');
  }

  /* ---------- 弹窗 / 抽屉 ---------- */
  function closeAll() { $$('.overlay').forEach((o) => o.remove()); }

  function openDialog(opts) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div class="dialog" style="${opts.width ? `width:${opts.width}` : ''}">
      <div class="dialog-head"><h3>${esc(opts.title)}</h3><button class="icon-btn" data-close>${svg('close')}</button></div>
      <div class="dialog-body">${opts.body}</div>
      <div class="dialog-foot"><button class="btn" data-close>取消</button><button class="btn primary" data-ok>${esc(opts.okText || '保存')}</button></div>
    </div>`;
    document.getElementById('overlayRoot').appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => overlay.remove()));
    overlay.querySelector('[data-ok]').addEventListener('click', () => {
      const values = {};
      let ok = true;
      overlay.querySelectorAll('[data-field]').forEach((el) => {
        values[el.dataset.field] = el.value.trim();
        if (el.dataset.required === 'true' && !el.value.trim()) { ok = false; el.style.borderColor = '#eb6262'; }
        else el.style.borderColor = '';
      });
      if (!ok) { toast('请填写必填项', 'warn'); return; }
      opts.onOk(values, overlay);
    });
  }

  function fieldHTML(f, values) {
    const v = values ? (values[f.key] == null ? '' : values[f.key]) : (f.value || '');
    const common = `data-field="${f.key}"${f.required ? ' data-required="true"' : ''}${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ''}`;
    let control;
    if (f.type === 'select') {
      control = `<select class="select" ${common}><option value="">请选择</option>${f.options.map((o) => `<option value="${esc(o)}"${v === o ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    } else if (f.type === 'textarea') {
      control = `<textarea class="input" ${common}>${esc(v)}</textarea>`;
    } else {
      control = `<input class="input" type="${f.type || 'text'}" ${common} value="${esc(v)}">`;
    }
    return `<div class="form-item${f.full ? ' full' : ''}"><label>${esc(f.label)}${f.required ? '<em>*</em>' : ''}</label>${control}${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</div>`;
  }

  function formBody(fields, values) {
    return `<form class="form-grid" onsubmit="return false">${fields.map((f) => fieldHTML(f, values)).join('')}</form>`;
  }

  function openDrawer(opts) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay drawer-overlay';
    overlay.innerHTML = `<aside class="drawer">
      <div class="drawer-head"><h3>${esc(opts.title)}</h3><button class="icon-btn" data-close>${svg('close')}</button></div>
      <div class="drawer-body">${opts.body}</div>
      <div class="drawer-foot">${opts.footer || '<button class="btn" data-close>关闭</button>'}</div>
    </aside>`;
    document.getElementById('overlayRoot').appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => overlay.remove()));
    if (opts.onMount) opts.onMount(overlay);
  }

  /* ---------- 员工 ---------- */
  function employeeForm(rec) {
    const fields = [
      { key: 'name', label: '姓名', required: true, placeholder: '请输入姓名' },
      { key: 'gender', label: '性别', type: 'select', options: ['男', '女'], required: true },
      { key: 'birth', label: '出生日期', type: 'date' },
      { key: 'idcard', label: '身份证号', placeholder: '18 位身份证号' },
      { key: 'nation', label: '民族', placeholder: '如 汉族' },
      { key: 'politics', label: '政治面貌', type: 'select', options: ['中共党员', '中共预备党员', '共青团员', '群众', '民主党派'] },
      { key: 'native', label: '籍贯', placeholder: '如 甘肃兰州' },
      { key: 'marriage', label: '婚姻状况', type: 'select', options: ['未婚', '已婚', '离异', '丧偶'] },
      { key: 'phone', label: '手机号', required: true, placeholder: '11 位手机号' },
      { key: 'email', label: '电子邮箱', placeholder: 'name@zhlh.com' },
      { key: 'unit', label: '所属单位', type: 'select', options: D.UNITS, required: true },
      { key: 'dept', label: '所属部门', type: 'select', options: D.DEPTS, required: true },
      { key: 'address', label: '现居住地址', full: true, placeholder: '省 / 市 / 区 + 详细地址' },
      { key: 'emergency', label: '紧急联系人', full: true, placeholder: '姓名（关系） 联系电话' },
      { key: 'photoNote', label: '免冠照片', type: 'text', full: true, placeholder: '点击上传或拖拽 JPG / PNG（演示不实际保存）' }
    ];
    const values = rec
      ? Object.assign({}, rec, { photoNote: rec.photo ? '已上传（可替换）' : '' })
      : { gender: '男', nation: '汉族', politics: '群众', marriage: '未婚', unit: '集团本部', dept: '生产运行部' };
    openDialog({
      title: rec ? `编辑员工档案 · ${rec.name}` : '新增员工档案',
      body: formBody(fields, values),
      onOk: (v) => {
        if (rec) {
          Object.assign(rec, v);
          toast('员工档案已更新', 'success');
        } else {
          const no = 'ZL' + (10000 + D.EMPLOYEES.length + 1);
          D.EMPLOYEES.unshift(Object.assign({
            no, status: '在职', position: '—', employment: '正式工', manager: '—', hireDate: '2026-10-29',
            probation: '6 个月', regularDate: '—', seniority: '0 年', workAge: '0 年', photo: false,
            education: [], resumes: [], family: [], certs: [],
            docs: [{ name: '身份证', files: ['待上传'], validTo: '长期', status: '待补充' }],
            archive: { no: 'DA-' + no, status: '在库', volumes: 1, inDate: '2026-10-29', index: '待补', lastOp: '新建档案', location: '—' }
          }, v));
          toast('员工档案已创建，待补全证件与合同信息', 'success');
        }
        closeAll(); renderMenu(); renderPage();
      }
    });
  }

  function workForm(rec) {
    const fields = [
      { key: 'name', label: '员工姓名', required: true, placeholder: '请输入姓名' },
      { key: 'employment', label: '用工性质', type: 'select', options: ['正式工', '劳务派遣', '返聘', '实习'], required: true },
      { key: 'unit', label: '所属单位', type: 'select', options: D.UNITS, required: true },
      { key: 'dept', label: '所属部门', type: 'select', options: D.DEPTS, required: true },
      { key: 'position', label: '岗位', required: true },
      { key: 'manager', label: '直接上级' },
      { key: 'hireDate', label: '入职日期', type: 'date', required: true },
      { key: 'probation', label: '试用期', type: 'select', options: ['3 个月', '6 个月', '无'] },
      { key: 'regularDate', label: '转正日期', type: 'date' },
      { key: 'status', label: '在职状态', type: 'select', options: ['在职', '试用期', '离职', '退休'], required: true },
      { key: 'seniority', label: '司龄', placeholder: '如 12.5 年' },
      { key: 'workAge', label: '工龄', placeholder: '如 13 年' }
    ];
    const values = rec || { employment: '正式工', unit: '集团本部', dept: '生产运行部', status: '在职', probation: '3 个月' };
    openDialog({
      title: rec ? `编辑工作信息 · ${rec.name}` : '新增用工登记',
      body: formBody(fields, values),
      onOk: (v) => {
        if (rec) { Object.assign(rec, v); toast('工作信息已更新，同步至组织架构与薪酬核算', 'success'); }
        else toast('用工登记已提交，待人力资源部审核', 'success');
        closeAll(); renderPage();
      }
    });
  }

  function employeeDrawer(e, focus) {
    if (!e) return;
    const edu = e.education[0] || {};
    const certs = e.certs.length ? e.certs.map((c) => softChip(c.name, c.review === '有效' ? 'green' : c.review === '逾期' ? 'red' : 'orange')).join(' ') : '<span class="sub">暂无登记</span>';
    const body = `
      <div class="detail-hero"><strong>${esc(e.name)} · ${esc(e.position)}</strong>
        <span>${esc(e.no)}　${esc(e.unit)} / ${esc(e.dept)}　${statusTag(e.status)}</span></div>
      <div class="photo-card">
        <div class="photo-box">${e.photo ? '照片<br>' + esc(e.name) : '暂无照片'}</div>
        <div class="photo-meta"><strong>${esc(e.name)}</strong>
          <span>${esc(e.gender)} · ${esc(e.nation)} · ${esc(e.politics)}</span>
          <span>出生日期 ${esc(e.birth)}　籍贯 ${esc(e.native)}</span>
          <span>${e.photo ? '照片已归档，符合 2 寸免冠要求' : '未上传免冠照片，请补采'}</span></div>
      </div>
      <div class="detail-section"><h4>基本信息</h4><dl class="desc-grid">
        <dt>身份证号</dt><dd>${esc(e.idcard)}</dd><dt>婚姻状况</dt><dd>${esc(e.marriage)}</dd>
        <dt>手机号码</dt><dd>${esc(e.phone)}</dd><dt>电子邮箱</dt><dd>${esc(e.email)}</dd>
        <dt>现居住地址</dt><dd style="grid-column:span 3">${esc(e.address)}</dd>
        <dt>紧急联系人</dt><dd style="grid-column:span 3">${esc(e.emergency)}</dd>
      </dl></div>
      <div class="detail-section"><h4>工作信息</h4><dl class="desc-grid">
        <dt>用工性质</dt><dd>${esc(e.employment)}</dd><dt>直接上级</dt><dd>${esc(e.manager)}</dd>
        <dt>入职日期</dt><dd>${esc(e.hireDate)}</dd><dt>转正日期</dt><dd>${esc(e.regularDate)}</dd>
        <dt>司龄 / 工龄</dt><dd>${esc(e.seniority)} / ${esc(e.workAge)}</dd><dt>在职状态</dt><dd>${statusTag(e.status)}</dd>
      </dl></div>
      <div class="detail-section"><h4>学历与履历</h4>
        <p>${edu.level ? `${esc(edu.level)} · ${esc(edu.school)} · ${esc(edu.major)} · ${esc(edu.degree)}（${esc(edu.gradDate)}）` : '暂无学历记录'}</p>
        <p style="margin-top:6px">最近履历：${e.resumes[0] ? `${esc(e.resumes[0].start)} — ${esc(e.resumes[0].end)}　${esc(e.resumes[0].unit)} · ${esc(e.resumes[0].position)}` : '暂无'}</p>
      </div>
      <div class="detail-section"><h4>资质证照</h4><p>${certs}</p></div>
      <div class="detail-section"><h4>人事档案</h4><dl class="desc-grid">
        <dt>档案编号</dt><dd>${esc(e.archive.no)}</dd><dt>档案状态</dt><dd>${statusTag(e.archive.status)}</dd>
        <dt>档案册数</dt><dd>${esc(e.archive.volumes)} 册</dd><dt>目录索引</dt><dd>${statusTag(e.archive.index)}</dd>
        <dt>存放位置</dt><dd style="grid-column:span 3">${esc(e.archive.location)}</dd>
      </dl></div>`;
    openDrawer({
      title: focus === 'work' ? '工作信息详情' : '员工档案详情',
      body,
      footer: '<button class="btn" data-close>关闭</button><button class="btn primary" data-edit>编辑档案</button>',
      onMount: (overlay) => overlay.querySelector('[data-edit]').addEventListener('click', () => { closeAll(); employeeForm(e); })
    });
  }

  function docsDrawer(e) {
    if (!e) return;
    openDrawer({
      title: `证件归档 · ${e.name}`,
      body: `<div class="detail-hero"><strong>${esc(e.name)}</strong><span>${esc(e.no)}　${esc(e.unit)} / ${esc(e.dept)}　共 ${e.docs.length} 类证件</span></div>
        <div class="doc-grid">${e.docs.map((d) => `<div class="doc-item"><div class="doc-icon">${svg('id')}</div>
          <div class="doc-body"><div class="doc-name">${esc(d.name)}${statusTag(d.status)}</div>
            <div class="doc-sub">有效期：${esc(d.validTo)} · ${esc(leftText(d.validTo))}</div>
            <div class="doc-files">${d.files.map((f) => `<a data-preview>${esc(f)}</a>`).join('')}</div></div></div>`).join('')}</div>
        <p class="panel-note">证件扫描件与原件一致性由人事专员核验；到期前 90 / 30 / 7 天自动提醒本人及直接上级。</p>`,
      onMount: (overlay) => overlay.querySelectorAll('[data-preview]').forEach((a) => a.addEventListener('click', () => toast('正在打开扫描件预览（演示环境）', 'info')))
    });
  }

  /* ---------- 学历 / 履历 ---------- */
  function eduForm() {
    const fields = [
      { key: 'name', label: '员工姓名', required: true },
      { key: 'level', label: '学历层次', type: 'select', options: ['全日制中专', '全日制大专', '全日制本科', '在职大专', '在职本科', '在职硕士', '全日制硕士', '博士'], required: true },
      { key: 'school', label: '毕业院校', required: true },
      { key: 'major', label: '专业', required: true },
      { key: 'degree', label: '学位', type: 'select', options: ['中专', '大专', '学士', '硕士', '博士', '无'] },
      { key: 'gradDate', label: '毕业时间', type: 'month' },
      { key: 'verify', label: '学信网认证', type: 'select', options: ['已认证', '待认证', '无法认证'] },
      { key: 'certNo', label: '证书编号' }
    ];
    openDialog({
      title: '新增学历记录', body: formBody(fields, { verify: '待认证' }),
      onOk: (v) => {
        const e = D.EMPLOYEES.find((x) => x.name === v.name);
        if (!e) { toast('未找到该员工，请先创建员工档案', 'warn'); return; }
        e.education.push({ level: v.level, school: v.school, major: v.major, degree: v.degree, gradDate: v.gradDate, verify: v.verify });
        toast('学历记录已保存，学信网认证通过后自动归档', 'success');
        closeAll(); renderPage();
      }
    });
  }

  function resumeForm() {
    const fields = [
      { key: 'name', label: '员工姓名', required: true },
      { key: 'start', label: '开始时间', type: 'month', required: true },
      { key: 'end', label: '结束时间', type: 'month', placeholder: '至今可留空' },
      { key: 'unit', label: '工作单位', required: true },
      { key: 'dept', label: '部门' },
      { key: 'position', label: '岗位', required: true },
      { key: 'type', label: '履历类型', type: 'select', options: ['内部调动', '外部经历'], required: true },
      { key: 'reason', label: '变动原因', full: true }
    ];
    openDialog({
      title: '录入工作履历', body: formBody(fields, { type: '内部调动' }),
      onOk: (v) => {
        const e = D.EMPLOYEES.find((x) => x.name === v.name);
        if (!e) { toast('未找到该员工', 'warn'); return; }
        e.resumes.unshift({ start: v.start, end: v.end || '至今', unit: v.unit, dept: v.dept, position: v.position, type: v.type, reason: v.reason });
        toast('工作履历已录入，内部调动信息将同步至工龄计算', 'success');
        closeAll(); renderPage();
      }
    });
  }

  function eduDrawer(e) {
    if (!e) return;
    openDrawer({
      title: `学历学位 · ${e.name}`,
      body: `<div class="detail-hero"><strong>${esc(e.name)}</strong><span>${esc(e.no)}　${esc(e.unit)} / ${esc(e.dept)}</span></div>
        ${e.education.map((x) => `<div class="detail-section"><h4>${esc(x.level)}　${statusTag(x.verify)}</h4>
          <dl class="desc-grid"><dt>毕业院校</dt><dd>${esc(x.school)}</dd><dt>专业</dt><dd>${esc(x.major)}</dd>
          <dt>学位</dt><dd>${esc(x.degree)}</dd><dt>毕业时间</dt><dd>${esc(x.gradDate)}</dd></dl></div>`).join('')}
        <div class="detail-section"><h4>学历材料</h4><p>毕业证书、学位证书扫描件已归档；学信网在线验证报告有效期内可直接调取。</p></div>`
    });
  }

  function resumeDrawer(e) {
    if (!e) return;
    openDrawer({
      title: `工作履历 · ${e.name}`,
      body: `<div class="detail-hero"><strong>${esc(e.name)}</strong><span>${esc(e.no)}　司龄 ${esc(e.seniority)} · 工龄 ${esc(e.workAge)}</span></div>
        ${e.resumes.map((r) => `<div class="detail-section"><h4>${esc(r.start)} — ${esc(r.end)}　${softChip(r.type, r.type === '内部调动' ? 'purple' : 'gray')}</h4>
          <p>${esc(r.unit)} · ${esc(r.dept)} · ${esc(r.position)}</p><p style="color:#a0a4b2">变动原因：${esc(r.reason)}</p></div>`).join('')}`
    });
  }

  function familyDrawer(e) {
    if (!e) return;
    openDrawer({
      title: `家庭成员 · ${e.name}`,
      body: `<div class="detail-hero"><strong>${esc(e.name)}</strong><span>${esc(e.no)}　主要社会关系 ${e.family.length} 人</span></div>
        ${e.family.map((f) => `<div class="detail-section"><h4>${esc(f.relation)}　${esc(f.name)}</h4><p>${esc(f.unit)}</p><p style="color:#a0a4b2">联系电话：${esc(f.phone)}</p></div>`).join('')}`
    });
  }

  /* ---------- 证书 ---------- */
  function certForm() {
    const fields = [
      { key: 'name', label: '员工姓名', required: true },
      { key: 'category', label: '证书类别', type: 'select', options: ['特种作业', '注册资格'], required: true },
      { key: 'certName', label: '证书名称', required: true, full: true, placeholder: '如 低压电工作业证 / 注册安全工程师' },
      { key: 'no', label: '证书编号', required: true },
      { key: 'issuer', label: '发证机关', required: true },
      { key: 'issueDate', label: '发证日期', type: 'date' },
      { key: 'validTo', label: '有效期至', required: true, placeholder: '如 2029-12-31 / 长期有效' },
      { key: 'review', label: '复审状态', type: 'select', options: ['有效', '待复审', '逾期'] }
    ];
    openDialog({
      title: '登记资质证照', body: formBody(fields, { category: '特种作业', review: '有效' }),
      onOk: (v) => {
        const e = D.EMPLOYEES.find((x) => x.name === v.name) || D.EMPLOYEES[0];
        const c = { category: v.category, name: v.certName, no: v.no, issuer: v.issuer, issueDate: v.issueDate, validTo: v.validTo, review: v.review || '有效' };
        D.CERTS.unshift(Object.assign({}, c, { id: 'NEW-' + Date.now(), empNo: e.no, empName: e.name, unit: e.unit, dept: e.dept, position: e.position }));
        toast('证书已登记，到期前 90 / 30 / 7 天自动预警', 'success');
        closeAll(); renderPage();
      }
    });
  }

  function certDrawer(c) {
    if (!c) return;
    openDrawer({
      title: '证书详情',
      body: `<div class="detail-hero"><strong>${esc(c.name)}</strong><span>${esc(c.empName)} · ${esc(c.unit)} / ${esc(c.dept)}　${statusTag(c.review)}</span></div>
        <div class="detail-section"><h4>证书信息</h4><dl class="desc-grid">
          <dt>证书类别</dt><dd>${softChip(c.category, c.category === '特种作业' ? 'blue' : 'purple')}</dd><dt>证书编号</dt><dd>${esc(c.no)}</dd>
          <dt>发证机关</dt><dd>${esc(c.issuer)}</dd><dt>发证日期</dt><dd>${esc(c.issueDate)}</dd>
          <dt>有效期至</dt><dd>${esc(c.validTo)}</dd><dt>剩余期限</dt><dd>${esc(leftText(c.validTo))}</dd>
        </dl></div>
        <div class="detail-section"><h4>复审记录</h4>
          <p>${c.review === '有效' ? '最近一次复审已通过，材料归档于人事档案第 5 类。' : c.review === '待复审' ? '已推送复审提醒，待本人提交体检与培训证明。' : '已逾期，系统已锁定上岗资格，须立即停岗并安排复审。'}</p></div>
        <div class="detail-section"><h4>使用要求</h4><p>特种作业人员须持证上岗，证书原件由本人保管，扫描件归档；注册类证书注册单位须与用工单位一致。</p></div>`,
      footer: '<button class="btn" data-close>关闭</button><button class="btn primary" data-renew>发起复审</button>',
      onMount: (overlay) => overlay.querySelector('[data-renew]').addEventListener('click', () => { closeAll(); toast('复审申报已提交至安全环保部', 'success'); })
    });
  }

  /* ---------- 档案 ---------- */
  function catalogDrawer(a) {
    if (!a) return;
    const missing = a.index === '待补';
    openDrawer({
      title: `档案目录 · ${a.empName}`,
      body: `<div class="detail-hero"><strong>${esc(a.no)}</strong><span>${esc(a.empName)} · ${esc(a.unit)} / ${esc(a.dept)}　${statusTag(a.status)}　${esc(a.volumes)} 册</span></div>
        <div class="detail-section"><h4>档案目录索引（共 10 类）</h4>
          <div class="catalog-tree">${D.CATALOG.map((c, i) => `<div class="catalog-item"><span class="c-no">${String(i + 1).padStart(2, '0')}</span><span class="c-name">${esc(c.name)}</span><span class="c-no">${c.count} 份</span>${statusTag(c.status)}</div>`).join('')}</div></div>
        <div class="detail-section"><h4>档案信息</h4><dl class="desc-grid">
          <dt>入库日期</dt><dd>${esc(a.inDate)}</dd><dt>存放位置</dt><dd>${esc(a.location)}</dd>
          <dt>电子化</dt><dd>${statusTag('已归档')}</dd><dt>目录索引</dt><dd>${statusTag(a.index)}</dd>
        </dl></div>
        <p class="panel-note">${missing ? '该档案缺少 2021 年度考核表，请人事专员在 15 个工作日内补齐并更新目录索引。' : '目录索引完整，扫描件与纸质件一致，最近一次核查记录：' + esc(a.lastOp) + '。'}</p>`,
      footer: '<button class="btn" data-close>关闭</button><button class="btn primary" data-borrow>借阅登记</button>',
      onMount: (overlay) => overlay.querySelector('[data-borrow]').addEventListener('click', () => { closeAll(); borrowForm(a, '借阅'); })
    });
  }

  function borrowForm(a, type) {
    if (!a) return;
    const fields = [
      { key: 'archive', label: '档案编号', value: a.no },
      { key: 'name', label: '员工姓名', value: a.empName },
      { key: 'type', label: '业务类型', type: 'select', options: ['借阅', '转递'], required: true },
      { key: 'operator', label: '经办人', required: true, placeholder: '如 李静' },
      { key: 'reason', label: '事由', required: true, full: true, placeholder: '如 职称评审材料复印 / 内部调动档案转递' },
      { key: 'expect', label: '预计归还 / 办结日期', type: 'date', required: true },
      { key: 'remark', label: '备注', full: true, placeholder: '接收单位、证明材料等' }
    ];
    openDialog({
      title: `${type}登记 · ${a.no}`,
      body: formBody(fields, { type, name: a.empName, archive: a.no }),
      onOk: (v) => {
        D.BORROWS.unshift({
          id: 'JY-2026-' + String(60 + D.BORROWS.length).padStart(4, '0'),
          archive: a.no, name: a.empName, unit: a.unit, type: v.type, date: '2026-10-29',
          operator: v.operator, reason: v.reason, status: v.type === '借阅' ? '借阅中' : '转递中', expect: v.expect
        });
        a.status = v.type === '借阅' ? '借出' : '待转递';
        toast(`${v.type}登记已保存，操作记录已写入档案日志`, 'success');
        closeAll(); renderPage();
      }
    });
  }

  function returnArchive(id) {
    const b = D.BORROWS.find((x) => x.id === id);
    if (!b) return;
    if (b.type === '转递') { toast(`转递单 ${b.id} 已进入跟踪状态，接收单位确认后自动归档`, 'info'); return; }
    b.status = '已归还';
    const a = D.ARCHIVES.find((x) => x.no === b.archive);
    if (a) a.status = '在库';
    toast(`档案 ${b.archive} 已归还入库，归还时间 2026-10-29 14:20`, 'success');
    renderPage();
  }

  /* ---------- 首页 ---------- */
  function showHome() {
    state.page = 'home';
    renderMenu();
    $('#page').innerHTML = `<div class="page-heading"><div class="heading-main"><div>
        <h1>员工信息管理 · 演示导览</h1>
        <p>本演示围绕「员工信息管理」下的 5 个子功能构建，全部为前端交互演示，数据为虚构样例。</p>
      </div></div></div>` + metrics([
      { label: '在册员工', value: '2,846', unit: '人', note: '较上月 +2.1%', cls: 'up', color: '#7659e7' },
      { label: '证件待更新', value: '24', unit: '项', note: '30 天内到期 17 项', cls: 'warn', color: '#e5a22a' },
      { label: '履历待补全', value: '15', unit: '人', note: '缺少外部经历证明', cls: 'warn', color: '#e5a22a' },
      { label: '借阅档案', value: '12', unit: '册', note: '超期未还 2 册', color: '#4389ed' }
    ]) + `<section class="panel-card"><div class="panel-header"><h3>五个子功能入口</h3><span class="panel-extra">点击进入对应演示页面</span></div>
      <div class="doc-grid">${[
        { k: 'basic', t: '基础信息', d: '个人信息档案 · 证件信息', i: 'id' },
        { k: 'work', t: '工作信息', d: '用工属性 · 在职状态', i: 'briefcase' },
        { k: 'education', t: '学历与履历', d: '学历学位 · 工作履历 · 家庭成员', i: 'book' },
        { k: 'certificate', t: '资质证照', d: '特种作业证 · 注册资格', i: 'award' },
        { k: 'archive', t: '人事档案', d: '档案电子化 · 借阅转递', i: 'folder' }
      ].map((x) => `<div class="doc-item" data-page="${x.k}" style="cursor:pointer"><div class="doc-icon">${svg(x.i)}</div>
        <div class="doc-body"><div class="doc-name">${x.t}</div><div class="doc-sub">${x.d}</div></div></div>`).join('')}</div></section>`;
    $$('#page [data-page]').forEach((el) => el.addEventListener('click', () => goPage(el.dataset.page)));
  }

  /* ---------- 初始化 ---------- */
  const initialPage = location.hash.replace('#', '');
  if (PAGES[initialPage]) state.page = initialPage;
  else if (initialPage === 'home') state.page = 'home';
  initHeader();
  renderMenu();
  bindPageEvents();
  renderPage();
})();
