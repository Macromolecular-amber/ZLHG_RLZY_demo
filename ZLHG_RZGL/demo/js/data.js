/* 演示数据：中陆化工集团员工信息（仅前端演示，数据为虚构） */
window.HR_DATA = (function () {
  const UNITS = ['集团本部', '三叶实业', '汇丰石化', '翔鑫工贸', '维达石化', '宏达人力', '兰达工贸'];
  const DEPTS = ['生产运行部', '设备管理部', '安全环保部', '技术中心', '质量管理部', '人力资源部', '财务部', '营销部', '综合办公室'];

  const EMPLOYEES = [
    {
      no: 'ZL10001', name: '张伟', gender: '男', birth: '1985-03-12', idcard: '620102198503124315', nation: '汉族',
      politics: '中共党员', native: '甘肃兰州', marriage: '已婚', phone: '138 1234 6621', email: 'zhangwei@zhlh.com',
      address: '兰州市西固区玉门街 12 号', emergency: '李梅（配偶） 139 0931 5520',
      unit: '集团本部', dept: '生产运行部', position: '调度员', employment: '正式工', manager: '李强',
      hireDate: '2008-07-01', probation: '3 个月', regularDate: '2008-10-01', status: '在职',
      seniority: '18.3 年', workAge: '20 年', photo: true,
      education: [
        { level: '全日制本科', school: '兰州理工大学', major: '化学工程与工艺', degree: '工学学士', gradDate: '2010-06', verify: '已认证' },
        { level: '在职硕士', school: '兰州交通大学', major: '项目管理', degree: '工程硕士', gradDate: '2019-12', verify: '已认证' }
      ],
      resumes: [
        { start: '2008-07', end: '至今', unit: '中陆化工集团', dept: '生产运行部', position: '调度员', type: '内部调动', reason: '集团生产调度岗位竞聘上岗' },
        { start: '2005-07', end: '2008-06', unit: '兰州石化公司', dept: '炼油厂', position: '操作工', type: '外部经历', reason: '个人发展' }
      ],
      family: [
        { relation: '配偶', name: '李梅', unit: '兰州市西固区人民医院', phone: '139 0931 5520' },
        { relation: '父亲', name: '张建国', unit: '已退休', phone: '138 0931 7734' },
        { relation: '子女', name: '张一诺', unit: '西固区第一小学', phone: '—' }
      ],
      certs: [
        { category: '注册资格', name: '注册安全工程师', no: '2018620100005678', issuer: '国家应急管理部', issueDate: '2018-06-30', validTo: '2029-06-30', review: '有效' }
      ],
      archive: { no: 'DA-2026-0101', status: '在库', volumes: 2, inDate: '2008-08-15', index: '完整', lastOp: '2026-10-12 档案核查', location: '综合档案室 A 区 03 柜' }
    },
    {
      no: 'ZL10002', name: '李静', gender: '女', birth: '1990-11-05', idcard: '620102199011051228', nation: '汉族',
      politics: '中共党员', native: '甘肃定西', marriage: '已婚', phone: '139 9310 8832', email: 'lijing@zhlh.com',
      address: '兰州市安宁区北滨河西路 66 号', emergency: '王磊（配偶） 138 0931 4412',
      unit: '集团本部', dept: '人力资源部', position: '人事专员', employment: '正式工', manager: '王芳',
      hireDate: '2014-04-10', probation: '6 个月', regularDate: '2014-10-10', status: '在职',
      seniority: '12.5 年', workAge: '13 年', photo: true,
      education: [
        { level: '全日制本科', school: '西北师范大学', major: '人力资源管理', degree: '管理学学士', gradDate: '2013-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2014-04', end: '至今', unit: '中陆化工集团', dept: '人力资源部', position: '人事专员', type: '内部调动', reason: '集团总部岗位调配' },
        { start: '2013-07', end: '2014-03', unit: '甘肃人力资源服务公司', dept: '招聘部', position: '招聘顾问', type: '外部经历', reason: '考录进入集团' }
      ],
      family: [
        { relation: '配偶', name: '王磊', unit: '兰州供电公司', phone: '138 0931 4412' },
        { relation: '母亲', name: '刘桂兰', unit: '已退休', phone: '139 0932 8867' }
      ],
      certs: [
        { category: '注册资格', name: '企业人力资源管理师（二级）', no: '2016000234', issuer: '甘肃省职业技能鉴定中心', issueDate: '2016-09-01', validTo: '长期有效', review: '有效' }
      ],
      archive: { no: 'DA-2026-0102', status: '在库', volumes: 2, inDate: '2014-05-20', index: '完整', lastOp: '2026-10-20 借阅归还', location: '综合档案室 A 区 04 柜' }
    },
    {
      no: 'ZL10003', name: '王强', gender: '男', birth: '1979-08-21', idcard: '620102197908210011', nation: '汉族',
      politics: '群众', native: '甘肃天水', marriage: '已婚', phone: '138 0931 2256', email: 'wangqiang@zhlh.com',
      address: '兰州市西固区福利路 88 号', emergency: '赵丽（配偶） 136 0931 6678',
      unit: '汇丰石化', dept: '设备管理部', position: '设备工程师', employment: '正式工', manager: '陈立',
      hireDate: '2003-09-01', probation: '3 个月', regularDate: '2003-12-01', status: '在职',
      seniority: '23.1 年', workAge: '25 年', photo: true,
      education: [
        { level: '全日制本科', school: '兰州交通大学', major: '机械设计制造及其自动化', degree: '工学学士', gradDate: '2002-06', verify: '已认证' },
        { level: '在职硕士', school: '兰州交通大学', major: '机械工程', degree: '工程硕士', gradDate: '2015-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2003-09', end: '至今', unit: '汇丰石化', dept: '设备管理部', position: '设备工程师', type: '内部调动', reason: '设备管理体系整合' }
      ],
      family: [
        { relation: '配偶', name: '赵丽', unit: '兰州石化总医院', phone: '136 0931 6678' },
        { relation: '子女', name: '王浩然', unit: '兰州交通大学（在读）', phone: '—' }
      ],
      certs: [
        { category: '特种作业', name: '特种设备作业人员证（压力容器）', no: 'TS6F620102197908210011', issuer: '甘肃省市场监督管理局', issueDate: '2020-11-01', validTo: '2026-10-31', review: '待复审' },
        { category: '注册资格', name: '设备监理师', no: '2012000123', issuer: '甘肃省人社厅', issueDate: '2012-05-01', validTo: '长期有效', review: '有效' }
      ],
      archive: { no: 'DA-2026-0103', status: '在库', volumes: 3, inDate: '2003-10-10', index: '完整', lastOp: '2026-09-18 职称材料归档', location: '综合档案室 B 区 01 柜' }
    },
    {
      no: 'ZL10004', name: '赵敏', gender: '女', birth: '1993-04-18', idcard: '620102199304185624', nation: '汉族',
      politics: '共青团员', native: '甘肃白银', marriage: '未婚', phone: '189 9312 7716', email: 'zhaomin@zhlh.com',
      address: '兰州市城关区雁滩路 218 号', emergency: '赵永福（父亲） 138 0943 2201',
      unit: '集团本部', dept: '财务部', position: '会计', employment: '正式工', manager: '王军',
      hireDate: '2016-07-15', probation: '6 个月', regularDate: '2017-01-15', status: '在职',
      seniority: '10.3 年', workAge: '11 年', photo: true,
      education: [
        { level: '全日制本科', school: '兰州财经大学', major: '会计学', degree: '管理学学士', gradDate: '2015-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2016-07', end: '至今', unit: '中陆化工集团', dept: '财务部', position: '会计', type: '外部经历', reason: '校园招聘入职' }
      ],
      family: [
        { relation: '父亲', name: '赵永福', unit: '白银有色集团', phone: '138 0943 2201' },
        { relation: '母亲', name: '孙秀英', unit: '已退休', phone: '138 0943 3390' }
      ],
      certs: [
        { category: '注册资格', name: '中级会计专业技术资格', no: '2018000567', issuer: '财政部', issueDate: '2018-05-20', validTo: '长期有效', review: '有效' }
      ],
      archive: { no: 'DA-2026-0104', status: '在库', volumes: 2, inDate: '2016-08-08', index: '完整', lastOp: '2026-10-09 学历材料补充', location: '综合档案室 A 区 05 柜' }
    },
    {
      no: 'ZL10005', name: '陈立', gender: '男', birth: '1988-06-30', idcard: '620102198806300019', nation: '汉族',
      politics: '中共党员', native: '甘肃兰州', marriage: '已婚', phone: '138 0931 4450', email: 'chenli@zhlh.com',
      address: '兰州市西固区合水路 51 号', emergency: '周敏（配偶） 138 0931 7732',
      unit: '三叶实业', dept: '生产运行部', position: '值班长', employment: '正式工', manager: '王强',
      hireDate: '2011-08-01', probation: '3 个月', regularDate: '2011-11-01', status: '在职',
      seniority: '15.2 年', workAge: '16 年', photo: true,
      education: [
        { level: '全日制大专', school: '兰州石化职业技术学院', major: '化工工艺', degree: '大专', gradDate: '2010-06', verify: '已认证' },
        { level: '在职本科', school: '兰州理工大学', major: '化学工程与工艺', degree: '工学学士', gradDate: '2021-12', verify: '已认证' }
      ],
      resumes: [
        { start: '2011-08', end: '至今', unit: '三叶实业', dept: '生产运行部', position: '值班长', type: '内部调动', reason: '班组管理岗位晋升' }
      ],
      family: [
        { relation: '配偶', name: '周敏', unit: '兰州石化公司', phone: '138 0931 7732' },
        { relation: '子女', name: '陈昱辰', unit: '西固区第一中学', phone: '—' }
      ],
      certs: [
        { category: '特种作业', name: '高处安装、维护、拆除作业证', no: 'T620102198806300019', issuer: '兰州市应急管理局', issueDate: '2024-03-10', validTo: '2030-03-10', review: '有效' },
        { category: '特种作业', name: '危险化学品安全作业证', no: 'T620102198806300018', issuer: '甘肃省应急管理厅', issueDate: '2023-09-01', validTo: '2029-09-01', review: '有效' }
      ],
      archive: { no: 'DA-2026-0105', status: '在库', volumes: 2, inDate: '2011-09-05', index: '待补', lastOp: '2026-08-22 缺 2021 年考核表', location: '综合档案室 B 区 02 柜' }
    },
    {
      no: 'ZL10006', name: '刘婷', gender: '女', birth: '1996-02-14', idcard: '620102199602142024', nation: '汉族',
      politics: '共青团员', native: '甘肃武威', marriage: '未婚', phone: '157 0935 3308', email: 'liuting@zhlh.com',
      address: '兰州市安宁区安宁西路 128 号', emergency: '刘建民（父亲） 138 0935 6612',
      unit: '翔鑫工贸', dept: '质量管理部', position: '化验员', employment: '正式工', manager: '郑霞',
      hireDate: '2019-03-20', probation: '6 个月', regularDate: '2019-09-20', status: '在职',
      seniority: '7.6 年', workAge: '8 年', photo: true,
      education: [
        { level: '全日制本科', school: '兰州大学', major: '应用化学', degree: '理学学士', gradDate: '2018-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2019-03', end: '至今', unit: '翔鑫工贸', dept: '质量管理部', position: '化验员', type: '外部经历', reason: '社会招聘入职' }
      ],
      family: [
        { relation: '父亲', name: '刘建民', unit: '武威市凉州区教育局', phone: '138 0935 6612' },
        { relation: '母亲', name: '张玉兰', unit: '已退休', phone: '138 0935 3390' }
      ],
      certs: [
        { category: '注册资格', name: '化学检验员（高级工）', no: '2019000456', issuer: '甘肃省职业技能鉴定中心', issueDate: '2019-11-01', validTo: '长期有效', review: '有效' }
      ],
      archive: { no: 'DA-2026-0106', status: '借出', volumes: 1, inDate: '2019-04-18', index: '完整', lastOp: '2026-10-15 借阅（职称评审）', location: '综合档案室 A 区 06 柜' }
    },
    {
      no: 'ZL10007', name: '孙慧', gender: '女', birth: '1982-09-09', idcard: '620102198209090048', nation: '汉族',
      politics: '群众', native: '甘肃临夏', marriage: '已婚', phone: '136 0930 1190', email: 'sunhui@zhlh.com',
      address: '兰州市七里河区西津西路 302 号', emergency: '马俊（配偶） 139 0930 8821',
      unit: '宏达人力', dept: '人力资源部', position: '人事专员', employment: '劳务派遣', manager: '李静',
      hireDate: '2018-01-05', probation: '无', regularDate: '2018-01-05', status: '在职',
      seniority: '8.8 年', workAge: '20 年', photo: false,
      education: [
        { level: '全日制本科', school: '甘肃政法大学', major: '行政管理', degree: '管理学学士', gradDate: '2005-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2018-01', end: '至今', unit: '宏达人力（派遣至集团本部）', dept: '人力资源部', position: '人事专员', type: '内部调动', reason: '劳务派遣岗位调整' },
        { start: '2005-07', end: '2017-12', unit: '兰州第三毛纺织厂', dept: '劳资科', position: '劳资员', type: '外部经历', reason: '企业改制分流' }
      ],
      family: [
        { relation: '配偶', name: '马俊', unit: '兰州公交集团', phone: '139 0930 8821' },
        { relation: '子女', name: '马思远', unit: '兰州市第八中学', phone: '—' }
      ],
      certs: [
        { category: '注册资格', name: '劳动关系协调员（二级）', no: '2017000789', issuer: '甘肃省人社厅', issueDate: '2017-05-01', validTo: '长期有效', review: '有效' }
      ],
      archive: { no: 'DA-2026-0107', status: '在库', volumes: 1, inDate: '2018-02-06', index: '完整', lastOp: '2026-07-14 派遣协议归档', location: '综合档案室 C 区 01 柜' }
    },
    {
      no: 'ZL10008', name: '周鹏', gender: '男', birth: '1991-12-25', idcard: '620102199112250015', nation: '汉族',
      politics: '群众', native: '甘肃兰州', marriage: '已婚', phone: '138 0931 9021', email: 'zhoupeng@zhlh.com',
      address: '兰州市西固区临洮街 9 号', emergency: '陈晓（配偶） 136 0931 5533',
      unit: '维达石化', dept: '设备管理部', position: '电气维修工', employment: '正式工', manager: '王强',
      hireDate: '2013-05-06', probation: '6 个月', regularDate: '2013-11-06', status: '在职',
      seniority: '13.4 年', workAge: '14 年', photo: true,
      education: [
        { level: '全日制大专', school: '甘肃机电职业技术学院', major: '电气自动化技术', degree: '大专', gradDate: '2012-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2013-05', end: '至今', unit: '维达石化', dept: '设备管理部', position: '电气维修工', type: '外部经历', reason: '社会招聘入职' }
      ],
      family: [
        { relation: '配偶', name: '陈晓', unit: '兰州石化公司', phone: '136 0931 5533' },
        { relation: '子女', name: '周雨桐', unit: '西固区第二小学', phone: '—' }
      ],
      certs: [
        { category: '特种作业', name: '低压电工作业证', no: 'T620102199112250015', issuer: '兰州市应急管理局', issueDate: '2022-11-20', validTo: '2026-11-20', review: '待复审' },
        { category: '特种作业', name: '高处作业证', no: 'T620102199112250014', issuer: '兰州市应急管理局', issueDate: '2024-08-15', validTo: '2026-08-15', review: '逾期' }
      ],
      archive: { no: 'DA-2026-0108', status: '待转递', volumes: 1, inDate: '2013-06-10', index: '完整', lastOp: '2026-10-18 转递至汇丰石化', location: '综合档案室 C 区 02 柜' }
    },
    {
      no: 'ZL10009', name: '吴磊', gender: '男', birth: '1995-05-16', idcard: '620102199505160013', nation: '汉族',
      politics: '共青团员', native: '甘肃定西', marriage: '已婚', phone: '183 0932 6650', email: 'wulei@zhlh.com',
      address: '兰州市新区中川街 18 号', emergency: '王晓（配偶） 182 0932 7712',
      unit: '兰达工贸', dept: '生产运行部', position: '化工操作工', employment: '正式工', manager: '陈立',
      hireDate: '2017-09-01', probation: '6 个月', regularDate: '2018-03-01', status: '在职',
      seniority: '9.1 年', workAge: '10 年', photo: true,
      education: [
        { level: '全日制大专', school: '兰州石化职业技术学院', major: '石油化工生产技术', degree: '大专', gradDate: '2016-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2017-09', end: '至今', unit: '兰达工贸', dept: '生产运行部', position: '化工操作工', type: '外部经历', reason: '校园招聘入职' }
      ],
      family: [
        { relation: '配偶', name: '王晓', unit: '兰州新区第一医院', phone: '182 0932 7712' }
      ],
      certs: [
        { category: '特种作业', name: '危险化学品安全作业证', no: 'T620102199505160013', issuer: '甘肃省应急管理厅', issueDate: '2022-12-15', validTo: '2026-12-15', review: '待复审' }
      ],
      archive: { no: 'DA-2026-0109', status: '在库', volumes: 1, inDate: '2017-10-08', index: '完整', lastOp: '2026-09-25 合同续签归档', location: '综合档案室 C 区 03 柜' }
    },
    {
      no: 'ZL10010', name: '郑霞', gender: '女', birth: '1987-07-07', idcard: '620102198707070024', nation: '汉族',
      politics: '中共党员', native: '甘肃兰州', marriage: '已婚', phone: '138 0931 7788', email: 'zhengxia@zhlh.com',
      address: '兰州市城关区天水南路 168 号', emergency: '刘刚（配偶） 138 0931 2245',
      unit: '汇丰石化', dept: '安全环保部', position: '安全员', employment: '正式工', manager: '张伟',
      hireDate: '2010-08-16', probation: '3 个月', regularDate: '2010-11-16', status: '在职',
      seniority: '16.2 年', workAge: '17 年', photo: true,
      education: [
        { level: '全日制本科', school: '兰州理工大学', major: '安全工程', degree: '工学学士', gradDate: '2009-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2010-08', end: '至今', unit: '汇丰石化', dept: '安全环保部', position: '安全员', type: '内部调动', reason: '安全环保部岗位调整' }
      ],
      family: [
        { relation: '配偶', name: '刘刚', unit: '兰州石化公司', phone: '138 0931 2245' },
        { relation: '子女', name: '刘欣妍', unit: '兰州市第三中学', phone: '—' }
      ],
      certs: [
        { category: '注册资格', name: '注册安全工程师', no: '2020620100001234', issuer: '国家应急管理部', issueDate: '2020-08-01', validTo: '2027-08-01', review: '有效' },
        { category: '特种作业', name: '危险化学品安全作业证', no: 'T620102198707070024', issuer: '甘肃省应急管理厅', issueDate: '2023-04-11', validTo: '2029-04-11', review: '有效' }
      ],
      archive: { no: 'DA-2026-0110', status: '在库', volumes: 2, inDate: '2010-09-20', index: '完整', lastOp: '2026-10-10 注册资格延续归档', location: '综合档案室 B 区 03 柜' }
    },
    {
      no: 'ZL10011', name: '马超', gender: '男', birth: '1998-10-20', idcard: '620102199810200031', nation: '回族',
      politics: '共青团员', native: '甘肃临夏', marriage: '未婚', phone: '191 0930 5512', email: 'machao@zhlh.com',
      address: '兰州市西固区陈官营 32 号', emergency: '马文华（父亲） 138 0930 6603',
      unit: '三叶实业', dept: '设备管理部', position: '焊工', employment: '实习', manager: '王强',
      hireDate: '2026-07-01', probation: '6 个月', regularDate: '—', status: '试用期',
      seniority: '0.3 年', workAge: '1 年', photo: false,
      education: [
        { level: '全日制中专', school: '兰州装备制造技师学院', major: '焊接技术', degree: '中专', gradDate: '2017-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2026-07', end: '至今', unit: '三叶实业', dept: '设备管理部', position: '焊工（实习）', type: '外部经历', reason: '校企合作定向培养' }
      ],
      family: [
        { relation: '父亲', name: '马文华', unit: '临夏州建筑公司', phone: '138 0930 6603' },
        { relation: '母亲', name: '马秀芳', unit: '家务', phone: '138 0930 7713' }
      ],
      certs: [
        { category: '特种作业', name: '熔化焊接与热切割作业证', no: 'T620102199810200031', issuer: '兰州市应急管理局', issueDate: '2023-05-30', validTo: '2029-05-30', review: '有效' }
      ],
      archive: { no: 'DA-2026-0111', status: '在库', volumes: 1, inDate: '2026-07-15', index: '待补', lastOp: '2026-07-15 新建档案（待补体检报告）', location: '综合档案室 C 区 04 柜' }
    },
    {
      no: 'ZL10012', name: '黄磊', gender: '男', birth: '1970-12-01', idcard: '620102197012010039', nation: '汉族',
      politics: '群众', native: '甘肃兰州', marriage: '已婚', phone: '138 0931 6600', email: 'huanglei@zhlh.com',
      address: '兰州市城关区嘉峪关路 26 号', emergency: '黄丽（女儿） 138 0931 9908',
      unit: '集团本部', dept: '技术中心', position: '工艺工程师', employment: '返聘', manager: '王强',
      hireDate: '2010-01-04', probation: '无', regularDate: '2010-01-04', status: '在职',
      seniority: '16.8 年', workAge: '35 年', photo: true,
      education: [
        { level: '全日制本科', school: '华东理工大学', major: '化学工程', degree: '工学学士', gradDate: '1993-06', verify: '已认证' },
        { level: '在职硕士', school: '华东理工大学', major: '化学工程', degree: '工程硕士', gradDate: '2004-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2010-01', end: '至今', unit: '中陆化工集团', dept: '技术中心', position: '工艺工程师（返聘）', type: '内部调动', reason: '退休后技术专家返聘' },
        { start: '1989-07', end: '2009-12', unit: '兰州炼油化工总厂', dept: '技术处', position: '工艺工程师', type: '外部经历', reason: '企业重组进入集团' }
      ],
      family: [
        { relation: '配偶', name: '陈慧兰', unit: '已退休', phone: '138 0931 3301' },
        { relation: '子女', name: '黄丽', unit: '兰州市第一人民医院', phone: '138 0931 9908' }
      ],
      certs: [
        { category: '注册资格', name: '化工总控工（高级技师）', no: '2015000123', issuer: '甘肃省人社厅', issueDate: '2018-01-01', validTo: '2028-01-01', review: '有效' }
      ],
      archive: { no: 'DA-2026-0112', status: '在库', volumes: 3, inDate: '2010-02-20', index: '完整', lastOp: '2026-10-08 返聘协议归档', location: '综合档案室 B 区 04 柜' }
    },
    {
      no: 'ZL10013', name: '何欣', gender: '女', birth: '1994-03-03', idcard: '620102199403030028', nation: '汉族',
      politics: '共青团员', native: '甘肃张掖', marriage: '未婚', phone: '187 0936 2245', email: 'hexin@zhlh.com',
      address: '兰州市七里河区敦煌路 118 号', emergency: '何建军（父亲） 138 0936 7712',
      unit: '翔鑫工贸', dept: '综合办公室', position: '行政专员', employment: '正式工', manager: '孙慧',
      hireDate: '2018-06-11', probation: '6 个月', regularDate: '2018-12-11', status: '离职',
      seniority: '8.3 年', workAge: '9 年', photo: false,
      education: [
        { level: '全日制本科', school: '河西学院', major: '汉语言文学', degree: '文学学士', gradDate: '2017-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2018-06', end: '2026-09', unit: '翔鑫工贸', dept: '综合办公室', position: '行政专员', type: '外部经历', reason: '个人原因离职（2026-09-30）' }
      ],
      family: [
        { relation: '父亲', name: '何建军', unit: '张掖市甘州区税务局', phone: '138 0936 7712' }
      ],
      certs: [],
      archive: { no: 'DA-2026-0113', status: '待转递', volumes: 1, inDate: '2018-07-02', index: '完整', lastOp: '2026-10-09 离职档案转递至人才中心', location: '综合档案室 C 区 05 柜' }
    },
    {
      no: 'ZL10014', name: '徐涛', gender: '男', birth: '1983-01-19', idcard: '620102198301190037', nation: '汉族',
      politics: '中共党员', native: '甘肃酒泉', marriage: '已婚', phone: '138 0937 9930', email: 'xutao@zhlh.com',
      address: '兰州市西固区化工街 45 号', emergency: '刘燕（配偶） 138 0937 2286',
      unit: '维达石化', dept: '生产运行部', position: '值班长', employment: '正式工', manager: '陈立',
      hireDate: '2007-03-01', probation: '3 个月', regularDate: '2007-06-01', status: '在职',
      seniority: '19.6 年', workAge: '21 年', photo: true,
      education: [
        { level: '全日制本科', school: '中国石油大学（华东）', major: '化学工程与工艺', degree: '工学学士', gradDate: '2005-06', verify: '已认证' }
      ],
      resumes: [
        { start: '2007-03', end: '至今', unit: '维达石化', dept: '生产运行部', position: '值班长', type: '内部调动', reason: '班组管理岗位晋升' }
      ],
      family: [
        { relation: '配偶', name: '刘燕', unit: '酒泉市人民医院', phone: '138 0937 2286' },
        { relation: '子女', name: '徐子涵', unit: '兰州理工大学（在读）', phone: '—' }
      ],
      certs: [
        { category: '特种作业', name: '危险化学品安全作业证', no: 'T620102198301190037', issuer: '甘肃省应急管理厅', issueDate: '2023-06-01', validTo: '2029-06-01', review: '有效' }
      ],
      archive: { no: 'DA-2026-0114', status: '在库', volumes: 2, inDate: '2007-04-12', index: '完整', lastOp: '2026-10-16 干部履历表更新', location: '综合档案室 B 区 05 柜' }
    }
  ];

  /* 证件归档：按员工证书自动生成，补充固定证件 */
  EMPLOYEES.forEach((e) => {
    const docs = [
      { name: '身份证', files: ['身份证（正面）.jpg', '身份证（反面）.jpg'], validTo: '长期', status: '已归档', type: 'ID' },
      { name: '户口本', files: ['户口本首页.jpg', '本人页.jpg'], validTo: '长期', status: e.no === 'ZL10011' ? '待补充' : '已归档', type: 'ID' },
      { name: '学历学位证书', files: ['毕业证书.jpg', '学位证书.jpg', '学信网认证报告.pdf'], validTo: '长期', status: '已归档', type: 'EDU' }
    ];
    e.certs.forEach((c) => {
      docs.push({
        name: c.name,
        files: [c.name + '扫描件.pdf', '证书编号页.jpg'],
        validTo: c.validTo,
        status: c.review === '逾期' ? '已逾期' : c.review === '待复审' ? '即将到期' : '已归档',
        type: 'CERT'
      });
    });
    e.docs = docs;
  });

  const CERTS = [];
  EMPLOYEES.forEach((e) => {
    e.certs.forEach((c, i) => {
      CERTS.push(Object.assign({}, c, {
        id: e.no + '-' + i,
        empNo: e.no,
        empName: e.name,
        unit: e.unit,
        dept: e.dept,
        position: e.position
      }));
    });
  });

  const ARCHIVES = EMPLOYEES.map((e) => Object.assign({}, e.archive, {
    empNo: e.no, empName: e.name, unit: e.unit, dept: e.dept, position: e.position, status2: e.status
  }));

  const BORROWS = [
    { id: 'JY-2026-0062', archive: 'DA-2026-0106', name: '刘婷', unit: '翔鑫工贸', type: '借阅', date: '2026-10-15', operator: '刘婷', reason: '职称评审材料复印', status: '借阅中', expect: '2026-11-15' },
    { id: 'JY-2026-0061', archive: 'DA-2026-0113', name: '何欣', unit: '翔鑫工贸', type: '转递', date: '2026-10-09', operator: '张伟', reason: '离职档案转递至兰州市人才中心', status: '转递中', expect: '2026-11-09' },
    { id: 'JY-2026-0060', archive: 'DA-2026-0108', name: '周鹏', unit: '维达石化', type: '转递', date: '2026-10-18', operator: '李静', reason: '内部调动档案转递至汇丰石化', status: '转递中', expect: '2026-11-18' },
    { id: 'JY-2026-0058', archive: 'DA-2026-0102', name: '李静', unit: '集团本部', type: '借阅', date: '2026-10-08', operator: '王芳', reason: '干部考察材料查阅', status: '已归还', expect: '2026-10-20' },
    { id: 'JY-2026-0056', archive: 'DA-2026-0101', name: '张伟', unit: '集团本部', type: '借阅', date: '2026-09-26', operator: '张伟', reason: '注册安全工程师延续注册', status: '已归还', expect: '2026-10-12' },
    { id: 'JY-2026-0051', archive: 'DA-2026-0110', name: '郑霞', unit: '汇丰石化', type: '借阅', date: '2026-09-02', operator: '郑霞', reason: '注册资格延续材料', status: '已归还', expect: '2026-10-10' },
    { id: 'JY-2026-0048', archive: 'DA-2026-0105', name: '陈立', unit: '三叶实业', type: '借阅', date: '2026-08-18', operator: '陈立', reason: '内部竞聘报名材料', status: '已归还', expect: '2026-09-01' },
    { id: 'JY-2026-0044', archive: 'DA-2026-0103', name: '王强', unit: '汇丰石化', type: '借阅', date: '2026-07-22', operator: '王强', reason: '职称评审业绩材料', status: '已归还', expect: '2026-08-05' }
  ];

  const CATALOG = [
    { name: '履历材料', count: 6, status: '完整' },
    { name: '自传材料', count: 2, status: '完整' },
    { name: '考核材料', count: 12, status: '完整' },
    { name: '学历学位材料', count: 4, status: '完整' },
    { name: '职称 / 职业资格材料', count: 5, status: '完整' },
    { name: '党团材料', count: 3, status: '完整' },
    { name: '奖励材料', count: 7, status: '完整' },
    { name: '处分材料', count: 0, status: '无' },
    { name: '工资 / 任免材料', count: 9, status: '完整' },
    { name: '劳动合同 / 协议', count: 4, status: '完整' }
  ];

  const MENU = [
    { key: 'home', title: '首页', icon: 'home', flat: true },
    { key: 'organization', title: '组织机构管理', icon: 'building', children: ['概览', '组织架构维护', '岗位与编制管理', '职位职级体系'] },
    { key: 'employee', title: '员工信息管理', icon: 'users', children: ['基础信息', '工作信息', '学历与履历', '资质证照', '人事档案'], open: true },
    { key: 'transfer', title: '员工异动管理', icon: 'swap', children: ['入转调离', '职务变动'] },
    { key: 'seniority', title: '工龄与司龄管理', icon: 'clock', children: ['工龄计算', '工龄认定', '工龄应用'] },
    { key: 'contract', title: '劳动合同与人事关系', icon: 'file', children: ['合同管理', '协议管理', '劳动争议'] },
    { key: 'recruit', title: '招聘与人员配置', icon: 'briefcase', children: ['招聘需求', '招聘执行', '招聘类型'] },
    { key: 'attendance', title: '考勤与排班管理', icon: 'calendar', children: ['排班管理', '考勤采集', '假勤管理', '加班管理'] },
    { key: 'salary', title: '薪酬管理', icon: 'wallet', children: ['薪酬体系', '薪资核算', '薪酬调整', '薪酬分析'] },
    { key: 'benefit', title: '福利管理（五险一金）', icon: 'heart', children: ['参保管理', '缴费核算', '待遇办理'] },
    { key: 'performance', title: '绩效考核管理', icon: 'chart', children: ['考核体系', '考核流程', '结果应用'] },
    { key: 'title', title: '职称与技能等级管理', icon: 'award', children: ['职称管理', '技能等级', '注册资格'] },
    { key: 'training', title: '培训与人才发展', icon: 'book', children: ['培训管理', '安全培训', '人才培养', '在线学习'] },
    { key: 'cadre', title: '干部管理与人才盘点', icon: 'usercheck', children: ['干部管理', '人才盘点', '政治面貌'] },
    { key: 'safety', title: '职业健康与安全管理', icon: 'shield', children: ['职业健康', '劳保管理', '安全积分'] },
    { key: 'relation', title: '员工关系与关怀', icon: 'message', children: ['员工关系', '关怀服务'] },
    { key: 'system', title: '报表分析与系统管理', icon: 'chart', children: ['统计分析', '系统管理'] }
  ];

  return { UNITS, DEPTS, EMPLOYEES, CERTS, ARCHIVES, BORROWS, CATALOG, MENU };
})();
